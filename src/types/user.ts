export type AvatarDecorationData = {
  asset: string;
  sku_id: string;
  expires_at: string | null;
};

export type PrimaryGuild = {
  identity_guild_id: string;
  identity_enabled: boolean;
  tag: string;
  badge: string;
};

export type Clan = {
  identity_guild_id: string;
  identity_enabled: boolean;
  tag: string;
  badge: string;
};

export type User = {
  id: string;
  username: string;
  global_name: string;
  avatar: string;
  avatar_decoration_data: AvatarDecorationData | null;
  collectibles: any;
  discriminator: string;
  public_flags: number;
  primary_guild: PrimaryGuild;
  clan: Clan;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: number;
  bio: string;
};

export type ConnectedAccount = {
  type: string;
  id: string;
  name: string;
  verified: boolean;
};

export type UserProfile = {
  bio: string;
  accent_color: number;
  pronouns: string;
  profile_effect: any;
  banner: string | null;
  theme_colors: number[];
  popout_animation_particle_type: any;
  emoji: any;
};

export type Badge = {
  id: string;
  description: string;
  icon: string;
  link?: string;
};

export type UserData = {
  user: User;
  connected_accounts: ConnectedAccount[];
  premium_type: number;
  premium_since: Date | null;
  premium_guild_since: string;
  mutual_guilds: any[];
  mutual_friends: any[];
  mutual_guilds_count: number;
  mutual_friends_count: number;
  profile_themes_experiment_bucket: number;
  user_profile: UserProfile;
  badges: Badge[];
  guild_badges: any[];
  legacy_username: string;
};
