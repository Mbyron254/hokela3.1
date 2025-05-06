'use client';

import Image from 'next/image';

import { parseRunOfferType } from '@/lib/helpers';
import { sourceImage } from '@/lib/server';
import { FC, useEffect, useState } from 'react';
import { GQLMutation } from '@/lib/client';
import { MutationButton } from '../MutationButton';
import { RUN_OFFER_TYPES, TABLE_IMAGE_HEIGHT, TABLE_IMAGE_WIDTH } from '@/lib/constant';
import {
  M_RUN_TEAMS,
  RUN_TEAM,
  RUN_TEAM_CREATE,
  RUN_TEAM_MEMBERS_ADD,
  RUN_TEAM_MEMBERS_REMOVE,
  RUN_TEAM_MEMBERS_TYPE_UPDATE,
  RUN_TEAM_UPDATE,
} from '@/lib/mutations/run-team.mutation';
import { M_CAMPAIGN_AGENTS } from '@/lib/mutations/run-offer.mutation';
import { LoadingDiv } from '../LoadingDiv';
import { DataTableStatic } from '../DataTableStatic';

export interface IRunTeamCreate {
  runId?: string;
  leaderId?: string;
  name?: string;
}

export interface IRunTeamUpdate {
  id?: string;
  leaderId?: string;
  name?: string;
}

export const RunTeam: FC<{
  run: any;
}> = ({ run }) => {
  const {
    action: getOffers,
    loading: loadingOffers,
    data: offers,
  } = GQLMutation({
    mutation: M_CAMPAIGN_AGENTS,
    resolver: 'runOffers',
    toastmsg: false,
  });
  const {
    action: getTeamOffers,
    loading: loadingTeamOffers,
    data: teamOffers,
  } = GQLMutation({
    mutation: M_CAMPAIGN_AGENTS,
    resolver: 'runOffers',
    toastmsg: false,
  });
  const {
    action: getRunTeams,
    loading: loadingTeams,
    data: runTeams,
  } = GQLMutation({
    mutation: M_RUN_TEAMS,
    resolver: 'runTeams',
    toastmsg: false,
  });
  const {
    action: getRunTeam,
    loading: loadingTeam,
    data: runTeam,
  } = GQLMutation({
    mutation: RUN_TEAM,
    resolver: 'runTeam',
    toastmsg: false,
  });
  const {
    action: create,
    loading: creating,
    data: created,
  } = GQLMutation({
    mutation: RUN_TEAM_CREATE,
    resolver: 'runTeamCreate',
    toastmsg: true,
  });
  const {
    action: update,
    loading: updating,
    data: updated,
  } = GQLMutation({
    mutation: RUN_TEAM_UPDATE,
    resolver: 'runTeamUpdate',
    toastmsg: true,
  });
  const {
    action: addTeamMembers,
    loading: addingTeamMembers,
    data: addedTeamMembers,
  } = GQLMutation({
    mutation: RUN_TEAM_MEMBERS_ADD,
    resolver: 'addTeamMembers',
    toastmsg: true,
  });
  const {
    action: removeTeamMembers,
    loading: removingTeamMembers,
    data: removedTeamMembers,
  } = GQLMutation({
    mutation: RUN_TEAM_MEMBERS_REMOVE,
    resolver: 'removeTeamMembers',
    toastmsg: true,
  });
  const {
    action: updateTeamMembersType,
    loading: updatingTeamMembersType,
    data: updatedTeamMembersType,
  } = GQLMutation({
    mutation: RUN_TEAM_MEMBERS_TYPE_UPDATE,
    resolver: 'updateTeamMembersType',
    toastmsg: true,
  });

  const _inputUpdate: IRunTeamUpdate = {
    id: undefined,
    leaderId: undefined,
    name: undefined,
  };

  const [inputCreate, setInputCreate] = useState<IRunTeamCreate>({
    leaderId: undefined,
    name: undefined,
  });
  const [inputUpdate, setInputUpdate] = useState(_inputUpdate);
  const [membersType, setMembersType] = useState<number>(0);
  const [selectedAgentsAdd, setSelectedAgentsAdd] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const loadOffers = () => {
    if (run?.id) {
      getOffers({ variables: { input: { runId: run.id } } });
    }
  };
  const loadRunTeams = () => {
    if (run?.id) {
      getRunTeams({ variables: { input: { runId: run.id } } });
    }
  };
  const loadTeamOffers = (teamId: string) => {
    getTeamOffers({ variables: { input: { teamId } } });
  };
  const loadRunTeam = (id: string) => {
    getRunTeam({ variables: { input: { id } } });
  };
  const handleCreate = () => {
    if (run?.id) {
      create({ variables: { input: { ...inputCreate, runId: run.id } } });
    }
  };
  const handleUpdate = () => {
    update({ variables: { input: inputUpdate } });
  };
  const handleAddTeamMembers = () => {
    if (inputUpdate.id && selectedAgentsAdd.length) {
      addTeamMembers({ variables: { input: { teamId: inputUpdate.id, agentIds: selectedAgentsAdd } } });
    }
  };
  const handleRemoveTeamMembers = () => {
    if (run?.id && selectedAgents.length) {
      removeTeamMembers({ variables: { input: { runId: run.id, agentIds: selectedAgents } } });
    }
  };
  const handleUpdateTeamMembersType = () => {
    if (run?.id && selectedAgents.length) {
      updateTeamMembersType({
        variables: { input: { runId: run.id, type: membersType, agentIds: selectedAgents } },
      });
    }
  };

  const columns = [
    {
      name: '#',
      width: '60px',
      sortable: true,
      selector: (row: any) => row.index,
      cell: (row: any) => row.index,
    },
    {
      name: 'AGENT',
      grow: 3,
      sortable: true,
      wrap: true,
      selector: (row: any) => row.agent?.user?.name,
      cell: (row: any) => (
        <>
          <Image
            className="me-1 mt-1 mb-1 rounded-circle"
            src={sourceImage(row.agent?.user?.photo?.fileName)}
            loader={() => sourceImage(row.agent?.user?.photo?.fileName)}
            alt=""
            width={TABLE_IMAGE_WIDTH}
            height={TABLE_IMAGE_HEIGHT}
          />
          <div className="w-100 overflow-hidden">
            <h6 className="mt-1 mb-1">{row.agent?.user?.name}</h6>
            <p className="mt-0 mb-1 text-muted">{row.agent?.user?.email}</p>
          </div>
        </>
      ),
    },
    {
      name: 'TYPE',
      grow: 2,
      sortable: true,
      selector: (row: any) => row.type,
      cell: (row: any) => {
        if (row.team?.leader?.id === row.agent?.id) {
          return (
            <>
              {row.team?.leader?.id === row.agent?.id && (
                <span className="badge bg-primary p-2">Team Leader</span>
              )}
            </>
          );
        } else {
          return parseRunOfferType(row.type);
        }
      },
    },
  ];

  useEffect(() => loadOffers(), [run?.id]);
  useEffect(
    () => loadRunTeams(),
    [run?.id, created, updated, addedTeamMembers, removedTeamMembers, updatedTeamMembersType],
  );
  useEffect(() => {
    if (runTeam) {
      setInputUpdate({
        id: runTeam.id,
        name: runTeam.name,
        leaderId: runTeam.leader?.id,
      });
    }
  }, [runTeam]);
  useEffect(() => {
    if (teamOffers?.rows?.length) {
      for (let i = 0; i < teamOffers.rows.length; i++) {
        setSelectedAgentsAdd((prev) => [...prev, teamOffers.rows[i].agent.id]);
      }
    }
  }, [teamOffers?.rows?.length]);

  return (
    <div className="row">
      <div className="col-md-12">
        <button
          type="button"
          className="btn btn-outline-success btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#new-team"
        >
          <i className="mdi mdi-plus"></i> New Team
        </button>

        <hr className="mt-3 mb-1" />

        {loadingTeams && <LoadingDiv />}

        {!runTeams?.rows.length && !loadingTeams && (
          <div className="alert alert-warning" role="alert">
            <strong>Ooops - </strong> No team has been created yet!
          </div>
        )}

        <div className="row">
          <div className="col-sm-3 mb-2 mb-sm-0">
            <div
              className="nav flex-column nav-pills"
              id="v-pills-tab"
              role="tablist"
              aria-orientation="vertical"
            >
              {runTeams?.rows.map((team: any, index: number) => (
                <a
                  key={`team-${index}`}
                  className={`nav-link ${index === 0 ? '' : ''}`}
                  id={`v-pills-team-${team.id}-tab`}
                  data-bs-toggle="pill"
                  href={`#v-pills-team-${team.id}`}
                  role="tab"
                  aria-controls={`v-pills-team-${team.id}`}
                  aria-selected="false"
                  onClick={() => {
                    setInputUpdate(_inputUpdate);
                    setSelectedAgentsAdd([]);
                    loadTeamOffers(team.id);
                    loadRunTeam(team.id);
                  }}
                >
                  <span className="d-md-block">
                    <span className="me-2">{index + 1}.</span>
                    {team.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="col-sm-9">
            <div className="tab-content" id="v-pills-tabContent">
              {runTeams?.rows.map((team: any, index: number) => (
                <div
                  key={`team-${index}`}
                  className={`tab-pane fade ${index === 0 ? '' : ''}`}
                  id={`v-pills-team-${team.id}`}
                  role="tabpanel"
                  aria-labelledby={`v-pills-team-${team.id}-tab`}
                >
                  <div className="card">
                    <div className="card-body">
                      {loadingTeamOffers ? (
                        <LoadingDiv />
                      ) : (
                        <>
                          <div className="row">
                            <div className="col-md-4">
                              <div className="input-group input-group-sm">
                                <select
                                  className="form-select"
                                  id="agentType"
                                  aria-label="Agent Type"
                                  defaultValue={membersType}
                                  onChange={(e) => setMembersType(parseInt(e.target.value))}
                                >
                                  {RUN_OFFER_TYPES.map((type: any, index: number) => (
                                    <option key={`type-${index}`} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                                <MutationButton
                                  type="button"
                                  className="btn btn-success"
                                  size="sm"
                                  label="Save"
                                  icon="mdi mdi-swap-horizontal"
                                  loading={updatingTeamMembersType}
                                  onClick={handleUpdateTeamMembersType}
                                />
                              </div>
                            </div>
                            <div className="col-md-8">
                              <MutationButton
                                type="button"
                                className="btn btn-danger float-end"
                                size="sm"
                                label="Remove"
                                icon="mdi mdi-cancel"
                                loading={removingTeamMembers}
                                onClick={handleRemoveTeamMembers}
                              />
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm float-end me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#update-modal"
                              >
                                <i className="mdi mdi-pen"></i> Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm float-end me-2"
                                data-bs-toggle="modal"
                                data-bs-target="#new-team-members"
                              >
                                <i className="mdi mdi-plus"></i> Add
                              </button>
                            </div>
                          </div>

                          <hr className="my-2" />

                          <DataTableStatic
                            selectorParent1="agent"
                            selectable={true}
                            dense={true}
                            fixedHeader={true}
                            columns={columns}
                            data={teamOffers?.rows}
                            loading={loadingOffers}
                            setSelected={setSelectedAgents}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- MODALS --- */}
        <div className="modal fade" id="new-team" tabIndex={-1} role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="newTeam">
                  New Team
                </h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
              </div>
              <div className="modal-body">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={inputCreate.name}
                    onChange={(e) =>
                      setInputCreate({
                        ...inputCreate,
                        name: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="name">Name</label>
                </div>
                {loadingOffers ? (
                  <LoadingDiv />
                ) : (
                  <div className="form-floating">
                    <select
                      id="leader"
                      className="form-select"
                      aria-label="Leader"
                      value={inputCreate.leaderId}
                      onChange={(e) =>
                        setInputCreate({
                          ...inputCreate,
                          leaderId: e.target.value === '' ? undefined : e.target.value,
                        })
                      }
                    >
                      <option></option>
                      {offers?.rows.map((offer: any, index: number) => (
                        <option value={offer.agent.id} key={`agent-${index}`}>
                          {offer.agent.user.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="leader">Leader</label>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">
                  Close
                </button>
                <MutationButton
                  type="button"
                  className="btn btn-success"
                  size="sm"
                  label="Create"
                  icon="mdi mdi-plus"
                  loading={creating}
                  onClick={handleCreate}
                />
              </div>
            </div>
          </div>
        </div>
        {/* .../... */}

        <div
          id="update-modal"
          className="modal fade"
          role="dialog"
          aria-labelledby="update-team"
          aria-hidden="true"
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            {loadingTeam ? (
              <LoadingDiv />
            ) : (
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="update-role">
                    Edit Team
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-hidden="true"
                  />
                </div>
                <div className="modal-body">
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={inputUpdate.name}
                      onChange={(e) =>
                        setInputUpdate({
                          ...inputUpdate,
                          name: e.target.value,
                        })
                      }
                    />
                    <label htmlFor="name">Category Name</label>
                  </div>
                  {loadingOffers ? (
                    <LoadingDiv />
                  ) : (
                    <div className="form-floating">
                      <select
                        id="leader"
                        className="form-select"
                        aria-label="Leader"
                        value={inputUpdate.leaderId}
                        onChange={(e) =>
                          setInputUpdate({
                            ...inputUpdate,
                            leaderId: e.target.value === '' ? undefined : e.target.value,
                          })
                        }
                      >
                        <option></option>
                        {offers?.rows.map((offer: any, index: number) => (
                          <option value={offer.agent.id} key={`agent-${index}`}>
                            {offer.agent.user.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="leader">Leader</label>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">
                    Close
                  </button>
                  <MutationButton
                    type="button"
                    className="btn btn-primary"
                    size="sm"
                    label="Update"
                    icon="mdi mdi-refresh"
                    loading={updating}
                    onClick={handleUpdate}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* .../... */}

        <div className="modal fade" id="new-team-members" tabIndex={-1} role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="newTeam">
                  Add Team Members
                </h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-hidden="true" />
              </div>
              <div className="modal-body">
                <DataTableStatic
                  selectorParent1="agent"
                  selectable={true}
                  dense={true}
                  fixedHeader={true}
                  columns={columns}
                  data={offers?.rows}
                  setSelected={setSelectedAgentsAdd}
                  loading={loadingOffers}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light btn-sm" data-bs-dismiss="modal">
                  Close
                </button>
                <MutationButton
                  type="button"
                  className="btn btn-success"
                  size="sm"
                  label="Add Members"
                  icon="mdi mdi-plus"
                  loading={addingTeamMembers}
                  onClick={handleAddTeamMembers}
                />
              </div>
            </div>
          </div>
        </div>
        {/* .../... */}
      </div>
    </div>
  );
};
