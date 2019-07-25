import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import { styled } from "linaria/react";
import copyToClipboard from "copy-to-clipboard";
import telehooksLogo from "../assets/telehooks-icon.svg";

interface Config {
  chatId?: string;
  key?: string;
  debug?: boolean;
}

const EditorWrapper = styled.div`
  .url {
    overflow-x: auto;
    white-space: nowrap;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 5rem;
    padding: 0.5rem 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }

  label > span {
    display: block;
    margin-bottom: 0.5rem;
  }

  input[type="text"] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-size: 2rem;
    appearance: none;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 2rem;
    padding: 0.5rem 1rem;
  }

  .main {
    display: flex;

    > label {
      flex-grow: 1;
      flex-basis: 0;
    }

    > :first-child {
      margin-right: 1rem;
    }
  }
`;

export const Editor: React.FC = () => {
  const [config, setConfig] = useState<Config>();
  const [hookUrl, setHookUrl] = useState<string>();

  const parseUrl = () => {
    const url = new URL(
      `/${window.location.hash.substr(1)}`,
      window.location.href,
    );

    console.log("Parsing URL:", url);

    const [chatId, key] = url.pathname.split("/").slice(1);

    const params = Array.from(url.searchParams).reduce(
      (acc, cur) => {
        acc[cur[0]] = cur[1];
        return acc;
      },
      {} as {
        [k: string]: string;
      },
    );

    console.log({ chatId, key, params });

    if (!chatId) {
      setConfig({});
      return;
    }

    setConfig(c => ({ ...c, ...params, chatId, key }));
  };

  useEffect(() => {
    parseUrl();
    window.addEventListener("hashchange", parseUrl);
    return () => window.removeEventListener("hashchange", parseUrl);
  }, []);

  useEffect(() => {
    if (!config) {
      return;
    }

    if (!config.chatId) {
      setHookUrl(undefined);
      return navigate("/");
    }

    const { key, chatId, ...params } = config;
    const configPath = [chatId, key].filter(Boolean).join("/");
    const url = new URL(`/#${configPath}`, window.location.href);

    for (const pKey of Object.keys(params)) {
      if (params[pKey]) {
        url.searchParams.set(pKey, params[pKey]);
      }
    }

    setHookUrl(
      new URL(
        `/hook/${configPath}${url.search}`,
        window.location.href,
      ).toString(),
    );
    navigate(url.pathname + url.hash + url.search);
  }, [config]);

  const handleInputChange = (
    key: keyof Config,
    { target }: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    console.log({ key, value });
    setConfig(c => ({ ...c, [key]: value ? value : undefined }));
  };

  return config ? (
    <EditorWrapper>
      {hookUrl ? (
        <div
          className="url"
          title="Copy to Clipboard"
          onClick={() => copyToClipboard(hookUrl)}
        >
          {hookUrl}
        </div>
      ) : (
        <div className="url">
          https://telehooks.dev/<span>[chat_id]</span>/<span>[token]</span>
        </div>
      )}
      <form>
        <div className="main">
          <label>
            <span>Chat ID</span>
            <input
              placeholder="Chat ID"
              type="text"
              value={config.chatId || ""}
              onChange={e => handleInputChange("chatId", e)}
            />
          </label>
          <label>
            <span>Bot Token (optional)</span>
            <input
              placeholder="Bot Token"
              type="text"
              value={config.key || ""}
              onChange={e => handleInputChange("key", e)}
            />
          </label>
        </div>

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={config.debug || false}
              onChange={e => handleInputChange("debug", e)}
            />
            Debug?
          </label>
        </div>
      </form>
    </EditorWrapper>
  ) : null;
};

const Index: React.FC = () => (
  <main>
    <img className="logo" src={telehooksLogo} />
    <Editor />
  </main>
);

export default Index;
