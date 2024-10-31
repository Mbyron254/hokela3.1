interface IMenuBadge {
  value: string;
  background: string;
}

export interface IMenuChildFourth {
  title: string;
  path: string;
  icon: string;
  badge?: IMenuBadge;
}

export interface IMenuChildThird {
  title: string;
  path: string;
  icon: string;
  children: IMenuChildFourth[];
  badge?: IMenuBadge;
}

export interface IMenuChildSecond {
  title: string;
  path: string;
  icon: string;
  children: IMenuChildThird[];
  badge?: IMenuBadge;
}

export interface IMenu {
  title: string;
  path: string;
  icon: string;
  children: IMenuChildSecond[];
  badge?: IMenuBadge;
  category?: string;
}

export interface IMainNavigation {
  menu: any;
}
