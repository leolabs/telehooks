export interface Event {
  rating?: string;
  event: string;
  user: boolean;
  owner: boolean;
  Account?: Account;
  Server?: Server;
  Player?: Player;
  Metadata?: Metadata;
}

export interface Account {
  id?: number;
  thumb?: string;
  title?: string;
}

export interface Metadata {
  librarySectionType?: string;
  ratingKey?: string;
  key?: string;
  parentRatingKey?: string;
  grandparentRatingKey?: string;
  guid?: string;
  parentGuid?: string;
  grandparentGuid?: string;
  librarySectionTitle?: string;
  librarySectionID?: number;
  librarySectionKey?: string;
  type?: string;
  title?: string;
  grandparentKey?: string;
  parentKey?: string;
  grandparentTitle?: string;
  parentTitle?: string;
  contentRating?: string;
  summary?: string;
  index?: number;
  parentIndex?: number;
  rating?: number;
  userRating?: number;
  viewOffset?: number;
  lastViewedAt?: number;
  year?: number;
  thumb?: string;
  art?: string;
  parentThumb?: string;
  grandparentThumb?: string;
  grandparentArt?: string;
  grandparentTheme?: string;
  originallyAvailableAt?: Date;
  addedAt?: number;
  updatedAt?: number;
  chapterSource?: string;
  Director?: Director[];
  Writer?: Director[];
  ratingCount?: number;
}

export interface Director {
  id?: number;
  filter?: string;
  tag?: string;
}

export interface Player {
  local?: boolean;
  publicAddress?: string;
  title?: string;
  uuid?: string;
}

export interface Server {
  title?: string;
  uuid?: string;
}

export interface Album {
  name?: string;
  artist?: Artist;
  tracks?: Track[];
}

export interface Artist {
  name?: string;
  founded?: number;
  members?: string[];
}

export interface Track {
  name?: string;
  duration?: number;
}
