import { gql } from '@apollo/client';

export const AREA_CREATE = gql`
  mutation areaCreate($input: InputAreaCreate!) {
    areaCreate(input: $input) {
      message
    }
  }
`;

export const AREA_UPDATE = gql`
  mutation areaUpdate($input: InputAreaUpdate!) {
    areaUpdate(input: $input) {
      message
    }
  }
`;

export const AREA_RECYCLE = gql`
  mutation areaRecycle($input: InputIds!) {
    areaRecycle(input: $input) {
      message
    }
  }
`;

export const AREA_RESTORE = gql`
  mutation areaRestore($input: InputIds!) {
    areaRestore(input: $input) {
      message
    }
  }
`;

export const AREA = gql`
  mutation area($input: InputId!) {
    area(input: $input) {
      id
      name
      color
      created
      coordinates {
        lat
        lng
      }
      # run {
      #   id
      # }
    }
  }
`;

export const AREAS = gql`
  mutation areas($input: InputAreas!) {
    areas(input: $input) {
      count
      rows {
        id
        name
        color
        created
        coordinates {
          lat
          lng
        }
        # run {
        #   id
        # }
      }
    }
  }
`;

export const AREAS_RECYCLED = gql`
  mutation areasRecycled($input: InputAreas!) {
    areasRecycled(input: $input) {
      count
      rows {
        id
        name
        color
        recycled
        coordinates {
          lat
          lng
        }
        # run {
        #   id
        # }
      }
    }
  }
`;
