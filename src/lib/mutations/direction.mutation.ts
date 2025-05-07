import { gql } from '@apollo/client';

export const DIRECTION_CREATE = gql`
  mutation directionCreate($input: InputDirectionCreate!) {
    directionCreate(input: $input) {
      message
    }
  }
`;

export const DIRECTION_UPDATE = gql`
  mutation directionUpdate($input: InputDirectionUpdate!) {
    directionUpdate(input: $input) {
      message
    }
  }
`;

export const DIRECTION_RECYCLE = gql`
  mutation directionRecycle($input: InputIds!) {
    directionRecycle(input: $input) {
      message
    }
  }
`;

export const DIRECTION_RESTORE = gql`
  mutation directionRestore($input: InputIds!) {
    directionRestore(input: $input) {
      message
    }
  }
`;

export const DIRECTION = gql`
  mutation direction($input: InputId!) {
    direction(input: $input) {
      id
      name
      startLat
      startLng
      stopLat
      stopLng
      travelMode
      created
      # run {
      #   id
      # }
    }
  }
`;

export const DIRECTIONS = gql`
  mutation directions($input: InputDirections!) {
    directions(input: $input) {
      count
      rows {
        id
        name
        startLat
        startLng
        stopLat
        stopLng
        travelMode
        created
        # run {
        #   id
        # }
      }
    }
  }
`;

export const DIRECTIONS_RECYCLED = gql`
  mutation directionsRecycled($input: InputDirections!) {
    directionsRecycled(input: $input) {
      count
      rows {
        id
        name
        startLat
        startLng
        stopLat
        stopLng
        travelMode
        recycled
        # run {
        #   id
        # }
      }
    }
  }
`;
