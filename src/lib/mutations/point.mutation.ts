import { gql } from '@apollo/client';

export const POINT_CREATE = gql`
  mutation pointCreate($input: InputPointCreate!) {
    pointCreate(input: $input) {
      message
    }
  }
`;

export const POINT_UPDATE = gql`
  mutation pointUpdate($input: InputPointUpdate!) {
    pointUpdate(input: $input) {
      message
    }
  }
`;

export const POINT_RECYCLE = gql`
  mutation pointRecycle($input: InputIds!) {
    pointRecycle(input: $input) {
      message
    }
  }
`;

export const POINT_RESTORE = gql`
  mutation pointRestore($input: InputIds!) {
    pointRestore(input: $input) {
      message
    }
  }
`;

export const POINT = gql`
  mutation point($input: InputId!) {
    point(input: $input) {
      id
      radius
      created
      shop {
        id
        name
        lat
        lng
        approved
        sector {
          id
          name
        }
        category {
          id
          name
        }
      }
      # run {
      #   id
      # }
    }
  }
`;

export const POINTS = gql`
  mutation points($input: InputPoints!) {
    points(input: $input) {
      count
      rows {
        id
        index
        created
        radius
        shop {
          id
          name
          lat
          lng
          approved
          sector {
            id
            name
          }
          category {
            id
            name
          }
        }
        # run {
        #   id
        # }
      }
    }
  }
`;

export const POINTS_RECYCLED = gql`
  mutation pointsRecycled($input: InputPoints!) {
    pointsRecycled(input: $input) {
      count
      rows {
        id
        index
        radius
        recycled
        shop {
          id
          name
          lat
          lng
          approved
          sector {
            id
            name
          }
          category {
            id
            name
          }
        }
        # run {
        #   id
        # }
      }
    }
  }
`;
