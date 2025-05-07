import { gql } from '@apollo/client';

export const RUN_TEAM_CREATE = gql`
  mutation runTeamCreate($input: InputRunTeamCreate!) {
    runTeamCreate(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM_UPDATE = gql`
  mutation runTeamUpdate($input: InputRunTeamUpdate!) {
    runTeamUpdate(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM_MEMBERS_ADD = gql`
  mutation addTeamMembers($input: InputRunTeamMembersAdd!) {
    addTeamMembers(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM_MEMBERS_REMOVE = gql`
  mutation removeTeamMembers($input: InputRunTeamMembersRemove!) {
    removeTeamMembers(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM_MEMBERS_TYPE_UPDATE = gql`
  mutation updateTeamMembersType($input: InputRunTeamMembersTypeUpdate!) {
    updateTeamMembersType(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM_RECYCLE = gql`
  mutation runTeamRecycle($input: InputIds!) {
    runTeamRecycle(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM_RESTORE = gql`
  mutation runTeamRestore($input: InputIds!) {
    runTeamRestore(input: $input) {
      message
    }
  }
`;

export const RUN_TEAM = gql`
  mutation runTeam($input: InputId!) {
    runTeam(input: $input) {
      id
      name
      created
      updated
      run {
        id
      }
      leader {
        id
        user {
          id
          name
        }
      }
    }
  }
`;

export const M_RUN_TEAMS = gql`
  mutation runTeams($input: InputRunTeams!) {
    runTeams(input: $input) {
      count
      rows {
        id
        index
        name
        created
        updated
        run {
          id
        }
        leader {
          id
          user {
            id
            name
          }
        }
      }
    }
  }
`;

export const M_RUN_TEAMS_RECYCLED = gql`
  mutation runTeamsRecycled($input: InputRunTeams!) {
    runTeamsRecycled(input: $input) {
      count
      rows {
        id
        index
        name
        created
        updated
        recycled
        run {
          id
        }
        leader {
          id
          user {
            id
            name
          }
        }
      }
    }
  }
`;

export const M_RUN_TEAMS_MINI = gql`
  mutation runTeams($input: InputRunTeams!) {
    runTeams(input: $input) {
      count
      rows {
        id
        name
      }
    }
  }
`;
