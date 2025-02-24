import { FC } from 'react';

export interface ContainerData {
  // Each container can extend this with its specific data structure
  [key: string]: any;
}

export interface ContainerProps {
  searchQuery: string;
}

export interface ContainerComponent {
  title: string;
  description: string;
  Component: FC<ContainerProps>;
} 