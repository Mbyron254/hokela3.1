'use client';

import Image from 'next/image';

import { FC, useEffect, useState } from 'react';
import { MutationButton } from '../MutationButton';
import { GQLMutation } from '@/lib/client';
import { M_PRODUCTS_MINI } from '@/lib/mutations/product.mutation';
import { DataTableStatic } from '../DataTableStatic';
import { M_CAMPAIGN_AGENTS, M_RUN_OFFERS_SEARCH } from '@/lib/mutations/run-offer.mutation';
import { sourceImage } from '@/lib/server';
import {
  CHOICE_MULTIPLE,
  CHOICE_SINGLE,
  DROPDOWN,
  TABLE_IMAGE_HEIGHT,
  TABLE_IMAGE_WIDTH,
} from '@/lib/constant';
import { M_PACKAGINGS_MINI } from '@/lib/mutations/packaging.mutation';
import { LoadingSpan } from '../LoadingSpan';
import {
  IAnswerDropdownOption,
  IChoice,
  IFreeGiveawayAllocations,
  IInventoryAllocation,
  IQuestionnairField,
} from '@/lib/interface/general.interface';
import {
  ALLOCATE_FREE_GIVEAWAY,
  M_AGENTS_FREE_GIVEAWAY_ALLOCATIONS,
} from '@/lib/mutations/free-giveaway-allocation.mutation';
import { QuestionnaireSetup } from '../QuestionnaireSetup';
import {
  FREE_GIVEAWAY_SURVEY,
  FREE_GIVEAWAY_SURVEY_UPSERT,
} from '@/lib/mutations/free-giveaway.mutation';
import { InputFreeGiveawaySurveyUpdate } from '@/lib/interface/survey-free-giveaway.interface';
import { M_STOCK_BALANCE } from '@/lib/mutations/inventory-allocation.mutation';
import { DataTable } from '../DataTable';
import { M_RUN_TEAMS_MINI } from '@/lib/mutations/run-team.mutation';

export const RunSampling: FC<IInventoryAllocation> = ({ runId, clientTier2Id }) => {
  const {
    action: getAgents,
    loading: loadingAgents,
    data: agents,
  } = GQLMutation({
    mutation: M_CAMPAIGN_AGENTS,
    resolver: 'runOffers',
    toastmsg: false,
  });
  const { action: getProducts, data: products } = GQLMutation({
    mutation: M_PRODUCTS_MINI,
    resolver: 'm_products',
    toastmsg: false,
  });
  const { action: getPackagings, data: packagings } = GQLMutation({
    mutation: M_PACKAGINGS_MINI,
    resolver: 'm_packagings',
    toastmsg: false,
  });
  const {
    action: getAllocations,
    loading: loadingAllocations,
    data: allocation,
  } = GQLMutation({
    mutation: M_AGENTS_FREE_GIVEAWAY_ALLOCATIONS,
    resolver: 'agentsFreeGiveawayAllocations',
    toastmsg: false,
  });
  const { action: allocate, loading: allocating } = GQLMutation({
    mutation: ALLOCATE_FREE_GIVEAWAY,
    resolver: 'allocateFreeGiveaway',
    toastmsg: true,
  });
  const { action: getStock, data: stock } = GQLMutation({
    mutation: M_STOCK_BALANCE,
    resolver: 'stockBalance',
    toastmsg: false,
  });
  const {
    action: upsertSurvey,
    loading: upsertingSurvey,
    data: upsertedSurvey,
  } = GQLMutation({
    mutation: FREE_GIVEAWAY_SURVEY_UPSERT,
    resolver: 'freeGiveawaySurveyUpsert',
    toastmsg: true,
  });
  const { action: getSurvey, data: survey } = GQLMutation({
    mutation: FREE_GIVEAWAY_SURVEY,
    resolver: 'freeGiveawaySurvey',
    toastmsg: false,
  });
  const {
    action: getTeams,
    loading: loadingTeams,
    data: teams,
  } = GQLMutation({
    mutation: M_RUN_TEAMS_MINI,
    resolver: 'runTeams',
    toastmsg: false,
  });

  const [product, setProduct] = useState<{ id?: string; packagingId?: string }>({
    id: undefined,
    packagingId: undefined,
  });
  const [allocations, setAllocations] = useState<IFreeGiveawayAllocations[]>([]);
  const [bulkFill, setBulkFill] = useState<boolean>(false);
  const [allocationTotal, setAllocationTotal] = useState<number>(0);
  const [questionnaireFields, setQuestionnaireFields] = useState<IQuestionnairField[]>([]);
  const [inputSurvey, setInputSurvey] = useState<InputFreeGiveawaySurveyUpdate>({
    hideRespondentFields: undefined,
    requireRespondentName: undefined,
    requireRespondentPhone: undefined,
    requireRespondentEmail: undefined,
    blockSameLocationReportsGlobally: undefined,
    blockSameLocationReportsPerAgent: undefined,
  });
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();
  const [teamId, setTeamId] = useState<string>();

  const loadTeams = () => {
    if (runId) {
      getTeams({ variables: { input: { runId } } });
    }
  };
  const loadAgents = (page?: number, pageSize?: number) => {
    if (runId) {
      getAgents({ variables: { input: { search, runId, teamId, page, pageSize } } });
    }
  };
  const loadProducts = () => {
    getProducts({ variables: { input: { clientTier2Id } } });
  };
  const loadPackagings = () => {
    if (product.id) {
      getPackagings({ variables: { input: { productId: product.id } } });
    }
  };
  const loadStock = () => {
    if (product.id && product.packagingId) {
      getStock({
        variables: {
          input: { productId: product.id, packagingId: product.packagingId },
        },
      });
    }
  };
  const loadAllocations = () => {
    if (runId && product.id && product.packagingId && selectedAgents) {
      getAllocations({
        variables: {
          input: {
            runId,
            productId: product.id,
            packagingId: product.packagingId,
            agents: selectedAgents,
          },
        },
      });
    }
  };
  const handleAllocate = () => {
    if (allocations.length) {
      const _allocations: { agentId: string; quantity: number }[] = [];

      for (let x = 0; x < allocations.length; x++) {
        _allocations.push({
          agentId: allocations[x].id,
          quantity: allocations[x].allocated,
        });
      }

      if (runId && product.id && product.packagingId && _allocations) {
        allocate({
          variables: {
            input: {
              runId,
              productId: product.id,
              packagingId: product.packagingId,
              allocations: _allocations,
            },
          },
        });
      } else {
        alert("Please select agent(s), a product and it's packaging");
      }
    } else {
      alert('Please search an agent then select him/her by clicking on a search result');
    }
  };
  const handleChange = (id: string, event: any) => {
    const _curr: IFreeGiveawayAllocations[] = [...allocations];

    let _allocationTotal = 0;

    for (let i = 0; i < _curr.length; i++) {
      if (bulkFill) {
        _curr[i].allocated = parseInt(event.target.value) | 0;
      } else {
        if (_curr[i].id === id) {
          const newAllocation = parseInt(event.target.value) | 0;

          _curr[i].allocated = newAllocation < _curr[i].givenAway ? _curr[i].givenAway : newAllocation;
        }
      }

      _allocationTotal += _curr[i].allocated;
    }
    setAllocations(_curr);
    setAllocationTotal(_allocationTotal);
  };
  const loadSurvey = () => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } });
    }
  };
  const handleSurveyUpsert = () => {
    if (runId && questionnaireFields.length) {
      for (let i = 0; i < questionnaireFields.length; i++) {
        switch (questionnaireFields[i].feedbackType) {
          case DROPDOWN:
            delete questionnaireFields[i].optionsChoiceSingle;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;

          case CHOICE_SINGLE:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;

          case CHOICE_MULTIPLE:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceSingle;
            break;

          default:
            delete questionnaireFields[i].optionsDropdown;
            delete questionnaireFields[i].optionsChoiceSingle;
            delete questionnaireFields[i].optionsChoiceMultiple;
            break;
        }
      }
      upsertSurvey({
        variables: { input: { ...inputSurvey, runId, questionnaireFields } },
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
      sortable: true,
      wrap: true,
      selector: (row: any) => row.date,
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
  ];

  useEffect(() => loadProducts(), []);
  useEffect(() => loadTeams(), [runId]);
  useEffect(() => loadPackagings(), [product.id]);
  useEffect(() => loadStock(), [product.id, product.packagingId]);
  useEffect(() => loadAllocations(), [product.id, product.packagingId, selectedAgents]);
  useEffect(() => loadSurvey(), [upsertedSurvey]);
  useEffect(() => {
    if (allocation?.entries) {
      const _allocations: IFreeGiveawayAllocations[] = [];

      let _allocationTotal = 0;

      for (let i = 0; i < allocation.entries.length; i++) {
        _allocations.push({
          index: allocation.entries[i].index,
          id: allocation.entries[i].agent?.id,
          name: allocation.entries[i].agent?.user?.name,
          photo: allocation.entries[i].agent?.user?.profile?.photo?.fileName,
          allocated: allocation.entries[i].quantityAllocated,
          givenAway: allocation.entries[i].quantityGivenAway,
        });
        _allocationTotal += allocation.entries[i].quantityAllocated;
      }
      setAllocations(_allocations);
      setAllocationTotal(_allocationTotal);
    }
  }, [allocation?.entries]);
  useEffect(() => {
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i++) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceSingle.length; k++) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k++) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsDropdown.length; k++) {
          _dropdown.push({
            value: survey.questionnaireFields[i].optionsDropdown[k].value,
            label: survey.questionnaireFields[i].optionsDropdown[k].label,
          });
        }

        _fields.push({
          id: survey.questionnaireFields[i].id,
          isRequired: survey.questionnaireFields[i].isRequired,
          noDuplicateResponse: survey.questionnaireFields[i].noDuplicateResponse,
          question: survey.questionnaireFields[i].question,
          feedbackType: survey.questionnaireFields[i].feedbackType,
          allowMultipleFileUploads: survey.questionnaireFields[i].allowMultipleFileUploads,
          optionsChoiceSingle: _singlechoice,
          optionsChoiceMultiple: _multichoice,
          optionsDropdown: _dropdown,
        });
      }

      setQuestionnaireFields(_fields);
      setInputSurvey({
        hideRespondentFields: survey.hideRespondentFields,
        requireRespondentName: survey.requireRespondentName,
        requireRespondentPhone: survey.requireRespondentPhone,
        requireRespondentEmail: survey.requireRespondentEmail,
        blockSameLocationReportsGlobally: survey.blockSameLocationReportsGlobally,
        blockSameLocationReportsPerAgent: survey.blockSameLocationReportsPerAgent,
      });
    }
  }, [survey]);

  return (
    <>
      {!survey && (
        <div className="col-12">
          <div className="alert alert-warning text-warning bg-transparent text-center" role="alert">
            Questionnaire not set. Agents will not be able to submit sampling reports!
          </div>
        </div>
      )}

      <ul className="nav nav-tabs nav-bordered mb-3">
        <li className="nav-item">
          <a
            href="#sampling-questions"
            data-bs-toggle="tab"
            aria-expanded="true"
            className="nav-link active"
          >
            <i className="mdi mdi-account-circle d-md-none d-block"></i>
            <span className="d-none d-md-block">Questions</span>
          </a>
        </li>
        <li className="nav-item">
          <a
            href="#sampling-stock-allocation"
            data-bs-toggle="tab"
            aria-expanded="false"
            className="nav-link"
          >
            <i className="mdi mdi-settings-outline d-md-none d-block"></i>
            <span className="d-none d-md-block">Stock Allocation</span>
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane show active" id="sampling-questions">
          <div className="card border-primary border">
            <div className="card-body pb-0">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="hideRespondentFieldsFreeGiveaway"
                      checked={inputSurvey.hideRespondentFields}
                      onClick={() =>
                        setInputSurvey({
                          ...inputSurvey,
                          hideRespondentFields: !inputSurvey.hideRespondentFields,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="hideRespondentFieldsFreeGiveaway">
                      Hide Respondent Fields
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireRespondentNameFreeGiveaway"
                      checked={inputSurvey.requireRespondentName}
                      onClick={() =>
                        setInputSurvey({
                          ...inputSurvey,
                          requireRespondentName: !inputSurvey.requireRespondentName,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="requireRespondentNameFreeGiveaway">
                      Require Respondent Name
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireRespondentPhoneFreeGiveaway"
                      checked={inputSurvey.requireRespondentPhone}
                      onClick={() =>
                        setInputSurvey({
                          ...inputSurvey,
                          requireRespondentPhone: !inputSurvey.requireRespondentPhone,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="requireRespondentPhoneFreeGiveaway">
                      Require Respondent Phone
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireRespondentEmailFreeGiveaway"
                      checked={inputSurvey.requireRespondentEmail}
                      onClick={() =>
                        setInputSurvey({
                          ...inputSurvey,
                          requireRespondentEmail: !inputSurvey.requireRespondentEmail,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="requireRespondentEmailFreeGiveaway">
                      Require Respondent Email
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="blockSameLocationReportsGloballyFreeGiveaway"
                      checked={inputSurvey.blockSameLocationReportsGlobally}
                      onClick={() =>
                        setInputSurvey({
                          ...inputSurvey,
                          blockSameLocationReportsGlobally:
                            !inputSurvey.blockSameLocationReportsGlobally,
                        })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="blockSameLocationReportsGloballyFreeGiveaway"
                    >
                      Block Same Location Reports Globally
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="blockSameLocationReportsPerAgentFreeGiveaway"
                      checked={inputSurvey.blockSameLocationReportsPerAgent}
                      onClick={() =>
                        setInputSurvey({
                          ...inputSurvey,
                          blockSameLocationReportsPerAgent:
                            !inputSurvey.blockSameLocationReportsPerAgent,
                        })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="blockSameLocationReportsPerAgentFreeGiveaway"
                    >
                      Block Same Location Reports Per Agent
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <QuestionnaireSetup
              questionnaireFields={questionnaireFields}
              setQuestionnaireFields={setQuestionnaireFields}
              mutation={handleSurveyUpsert}
              mutating={upsertingSurvey}
            />
          </div>
        </div>

        <div className="tab-pane" id="sampling-stock-allocation">
          <div className="row">
            <div className="col-md-5">
              <div className="card border border-primary">
                <div className="card-body">
                  {loadingTeams ? (
                    <LoadingSpan />
                  ) : (
                    <div className="mb-3">
                      <label htmlFor="team">Filter by team</label>
                      <select
                        id="team"
                        className="form-select mt-2"
                        aria-label="Filter By Team"
                        value={teamId}
                        onChange={(e) => setTeamId(e.target.value)}
                      >
                        <option></option>
                        {teams?.rows.map((team: any, index: number) => (
                          <option value={team.id} key={`team-${index}`}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="app-search mb-3">
                    <div className="input-group">
                      <input
                        type="text"
                        id="top-search"
                        className="form-control dropdown-toggle"
                        placeholder="Search agent..."
                        defaultValue={search}
                        onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)}
                      />
                      <span className="mdi mdi-magnify search-icon"></span>
                      <button
                        className="input-group-text btn-primary"
                        type="button"
                        disabled={loadingAgents}
                        onClick={() => loadAgents(0, 10)}
                      >
                        {loadingAgents && (
                          <>
                            <i className="spinner-border spinner-border-sm me-1" role="status" />
                            Loading
                          </>
                        )}

                        {!loadingAgents && <>Search</>}
                      </button>
                    </div>
                  </div>

                  <hr className="mb-2" />

                  <DataTable
                    selectorParent1="agent"
                    selectable={true}
                    dense={true}
                    fixedHeader={true}
                    columns={columns}
                    data={agents?.rows}
                    totalRows={agents?.count}
                    setSelected={setSelectedAgents}
                    loading={loadingAgents}
                    handleReloadMutation={loadAgents}
                    reloadTriggers={[runId, teamId]}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card border-primary border">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <select
                          id="product"
                          className="form-select"
                          aria-label="Product"
                          defaultValue={product.id}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              id: e.target.value === '' ? undefined : e.target.value,
                            })
                          }
                        >
                          <option></option>
                          {products?.rows.map((product: any, index: number) => (
                            <option value={product.id} key={`product-${index}`}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="product">Product</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <select
                          id="packaging"
                          className="form-select"
                          aria-label="Packaging"
                          defaultValue={product.packagingId}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              packagingId: e.target.value === '' ? undefined : e.target.value,
                            })
                          }
                        >
                          <option></option>
                          {packagings?.rows.map((packaging: any, index: number) => (
                            <option key={`packaging-${index}`} value={packaging.id}>
                              {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="packaging">Packaging</label>
                      </div>
                    </div>
                  </div>

                  <hr className="mt-0 mb-0" />

                  <h5 className="mb-0">
                    Allocated {allocationTotal} of {stock?.balPackage ? stock.balPackage : 0} units
                  </h5>
                </div>
              </div>

              <div className="card border-primary border">
                <div className="card-body p-3">
                  <h5 className="card-title">
                    <span className="text-uppercase">Allocations</span>
                    {loadingAllocations ? <LoadingSpan /> : undefined}
                    <span className="float-end">
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="bulkFill"
                          disabled={allocation?.canBulkFill}
                          onClick={() => setBulkFill(!bulkFill)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="bulkFill"
                          style={{ marginTop: '3px' }}
                        >
                          Bulk Fill
                        </label>
                      </div>
                    </span>
                  </h5>

                  <hr className="mt-0 mb-1" />

                  <div className="mb-2">
                    {allocations?.map((allocation: any, index: number) => (
                      <div key={`allocation-${index}`}>
                        <dl className="row mb-0">
                          <dt className="col-sm-7">
                            <span className="me-2">{allocation.index}.</span>
                            <Image
                              className="me-2 mt-1 mb-1"
                              src={sourceImage(allocation.photo)}
                              loader={() => sourceImage(allocation.photo)}
                              alt=""
                              width={TABLE_IMAGE_WIDTH}
                              height={TABLE_IMAGE_HEIGHT}
                            />
                            {allocation.name}
                          </dt>
                          <dd className="col-sm-5">
                            <div className="input-group input-group-sm">
                              <input
                                type="text"
                                className="form-control form-control-sm font-14"
                                disabled={true}
                                placeholder={`Given away: ${allocation.givenAway}`}
                              />
                              <input
                                type="number"
                                id="quantity-1"
                                className="form-control form-control-sm font-14"
                                min={allocation.givenAway}
                                value={allocation.allocated}
                                onChange={(e) => handleChange(allocation.id, e)}
                              />
                            </div>
                          </dd>
                        </dl>

                        <hr className="mt-0 mb-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <MutationButton
                type="button"
                size="sm"
                label="Save"
                icon="mdi mdi-refresh"
                className="float-end mb-3"
                loading={allocating}
                onClick={handleAllocate}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
