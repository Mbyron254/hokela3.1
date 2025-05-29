'use client';

import Image from 'next/image';
import { Icon } from '@iconify/react';

import { FC, useEffect, useRef, useState } from 'react';
import { M_CAMPAIGN_AGENTS } from 'src/lib/mutations/run-offer.mutation';
import { M_PRODUCTS_MINI } from 'src/lib/mutations/product.mutation';
import { GQLMutation } from 'src/lib/client';
import {
  CHOICE_MULTIPLE,
  CHOICE_SINGLE,
  DROPDOWN,
  TABLE_IMAGE_HEIGHT,
  TABLE_IMAGE_WIDTH,
} from 'src/lib/constant';
import { M_PACKAGINGS_MINI } from 'src/lib/mutations/packaging.mutation';
import {
  IAnswerDropdownOption,
  IChoice,
  IFreeGiveawayAllocations,
  IInventoryAllocation,
  IQuestionnairField,
} from 'src/lib/interface/general.interface';
import {
  ALLOCATE_FREE_GIVEAWAY,
  M_AGENTS_FREE_GIVEAWAY_ALLOCATIONS,
} from 'src/lib/mutations/free-giveaway-allocation.mutation';
import {
  FREE_GIVEAWAY_SURVEY,
  FREE_GIVEAWAY_SURVEY_UPSERT,
} from 'src/lib/mutations/free-giveaway.mutation';
import { M_STOCK_BALANCE } from 'src/lib/mutations/inventory-allocation.mutation';
import { M_RUN_TEAMS_MINI } from 'src/lib/mutations/run-team.mutation';
import { InputFreeGiveawaySurveyUpdate } from 'src/lib/interface/survey-free-giveaway.interface';

import { sourceImage } from 'src/lib/server';
import { TextField, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Box, Typography, FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl, Button, CircularProgress } from '@mui/material';
import { QuestionnaireSetup } from '../QuestionnaireSetup';

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
  const [activeTab, setActiveTab] = useState<number>(0);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);


  const loadAgents = (page?: number, pageSize?: number) => {
    if (runId) {
      getAgents({ variables: { input: { search, runId, teamId, page, pageSize } } });
    }
  };

  const handleAllocate = () => {
    if (allocations.length) {
      const _allocations: { agentId: string; quantity: number }[] = [];

      for (let x = 0; x < allocations.length; x += 1) {
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

    for (let i = 0; i < _curr.length; i += 1) {
      if (bulkFill) {
        _curr[i].allocated = parseInt(event.target.value, 10) || 0;
      } else if (_curr[i].id === id) {
        const newAllocation = parseInt(event.target.value, 10) || 0;

        _curr[i].allocated = newAllocation < _curr[i].givenAway ? _curr[i].givenAway : newAllocation;
      }

      _allocationTotal += _curr[i].allocated;
    }
    setAllocations(_curr);
    setAllocationTotal(_allocationTotal);
  };

  const handleSurveyUpsert = () => {
    if (runId && questionnaireFields.length) {
      for (let i = 0; i < questionnaireFields.length; i += 1) {
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
    { id: 'index', label: '#', minWidth: 60 },
    { id: 'agent', label: 'AGENT', minWidth: 170 },
  ];

  const renderAgentCell = (row: any) => (
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
  );

  useEffect(() => {
    getProducts({ variables: { input: { clientTier2Id } } })
  }, [getProducts, clientTier2Id]);

  useEffect(() => {
    getTeams({ variables: { input: { runId } } })
  }, [getTeams, runId]);

  useEffect(() => {
    if (product.id) {
      getPackagings({ variables: { input: { productId: product.id } } })
    }
  }, [getPackagings, product.id]);

  useEffect(() => {
    if (product.id && product.packagingId) {
      getStock({ variables: { input: { productId: product.id, packagingId: product.packagingId } } }).catch((err: any) => {
        if (!isMounted.current) return;
        console.error('Stock fetch error:', err);
      });
    }
  }, [getStock, product.id, product.packagingId]);

  useEffect(() => {
    if (runId && product.id && product.packagingId && selectedAgents.length > 0) {
      getAllocations({
        variables: {
          input: {
            runId,
            productId: product.id,
            packagingId: product.packagingId,
            agents: selectedAgents,
          },
        },
      })
    }
  }, [getAllocations, runId, product.id, product.packagingId, selectedAgents]);

  useEffect(() => {
    if (runId) {
      getSurvey({ variables: { input: { runId } } })
    }
  }, [getSurvey, runId]);

  // ... existing code ...
  useEffect(() => {
    if (!isMounted.current) return;
    if (allocation?.entries) {
      const _allocations: IFreeGiveawayAllocations[] = [];
      let _allocationTotal = 0;

      allocation.entries.forEach((entry: any) => {
        _allocations.push({
          index: entry.index,
          id: entry.agent?.id,
          name: entry.agent?.user?.name,
          photo: entry.agent?.user?.profile?.photo?.fileName,
          allocated: entry.quantityAllocated,
          givenAway: entry.quantityGivenAway,
        });
        _allocationTotal += entry.quantityAllocated;
      });

      setAllocations(_allocations);
      setAllocationTotal(_allocationTotal);
    }
  }, [allocation?.entries]);
  // ... existing code ...

  useEffect(() => {
    if (!isMounted.current) return;
    if (survey) {
      const _fields = [];

      for (let i = 0; i < survey.questionnaireFields.length; i += 1) {
        const _dropdown: IAnswerDropdownOption[] = [];
        const _singlechoice: IChoice[] = [];
        const _multichoice: IChoice[] = [];

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceSingle.length; k += 1) {
          _singlechoice.push({
            text: survey.questionnaireFields[i].optionsChoiceSingle[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceSingle[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsChoiceMultiple.length; k += 1) {
          _multichoice.push({
            text: survey.questionnaireFields[i].optionsChoiceMultiple[k].text,
            documentId: survey.questionnaireFields[i].optionsChoiceMultiple[k].documentId,
          });
        }

        for (let k = 0; k < survey.questionnaireFields[i].optionsDropdown.length; k += 1) {
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
    <Box sx={{ padding: 2 }}>
      {!survey && (
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="body2" color="warning.main" align="center">
            Questionnaire not set. Agents will not be able to submit sampling reports!
          </Typography>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} aria-label="basic tabs example">
          <Tab label="Questions" />
          <Tab label="Stock Allocation" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Switch checked={inputSurvey.hideRespondentFields} onChange={() => setInputSurvey({ ...inputSurvey, hideRespondentFields: !inputSurvey.hideRespondentFields })} />}
                label="Hide Respondent Fields"
              />
              <FormControlLabel
                control={<Switch checked={inputSurvey.requireRespondentName} onChange={() => setInputSurvey({ ...inputSurvey, requireRespondentName: !inputSurvey.requireRespondentName })} />}
                label="Require Respondent Name"
              />
              <FormControlLabel
                control={<Switch checked={inputSurvey.requireRespondentPhone} onChange={() => setInputSurvey({ ...inputSurvey, requireRespondentPhone: !inputSurvey.requireRespondentPhone })} />}
                label="Require Respondent Phone"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={<Switch checked={inputSurvey.requireRespondentEmail} onChange={() => setInputSurvey({ ...inputSurvey, requireRespondentEmail: !inputSurvey.requireRespondentEmail })} />}
                label="Require Respondent Email"
              />
              <FormControlLabel
                control={<Switch checked={inputSurvey.blockSameLocationReportsGlobally} onChange={() => setInputSurvey({ ...inputSurvey, blockSameLocationReportsGlobally: !inputSurvey.blockSameLocationReportsGlobally })} />}
                label="Block Same Location Reports Globally"
              />
              <FormControlLabel
                control={<Switch checked={inputSurvey.blockSameLocationReportsPerAgent} onChange={() => setInputSurvey({ ...inputSurvey, blockSameLocationReportsPerAgent: !inputSurvey.blockSameLocationReportsPerAgent })} />}
                label="Block Same Location Reports Per Agent"
              />
            </Box>
          </Box>

          <QuestionnaireSetup
            questionnaireFields={questionnaireFields}
            setQuestionnaireFields={setQuestionnaireFields}
            mutation={handleSurveyUpsert}
            mutating={upsertingSurvey}
          />
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="team-select-label">Filter by team</InputLabel>
              <Select
                labelId="team-select-label"
                id="team-select"
                value={teamId}
                label="Filter by team"
                onChange={(e) => setTeamId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select Team</em>
                </MenuItem>
                {teams?.rows.map((team: any, index: number) => (
                  <MenuItem value={team.id} key={`team-${index}`}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                id="top-search"
                label="Search agent..."
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value === '' ? undefined : e.target.value)}
                sx={{ marginRight: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => loadAgents(0, 10)}
                disabled={loadingAgents}
                startIcon={loadingAgents ? <CircularProgress size={20} /> : <Icon icon="mdi:magnify" />}
              >
                {loadingAgents ? 'Loading' : 'Search'}
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {agents?.rows.map((row: any, index: number) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAgents.includes(row.agent?.id)}
                        onChange={() => {
                          const newSelected = [...selectedAgents];
                          if (newSelected.includes(row.agent?.id)) {
                            newSelected.splice(newSelected.indexOf(row.agent?.id), 1);
                          } else {
                            newSelected.push(row.agent?.id);
                          }
                          setSelectedAgents(newSelected);
                        }}
                      />
                    </TableCell>
                    <TableCell>{renderAgentCell(row)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ marginTop: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="product-select-label">Product</InputLabel>
                <Select
                  labelId="product-select-label"
                  id="product-select"
                  value={product.id}
                  label="Product"
                  onChange={(e) => setProduct({ ...product, id: e.target.value === '' ? undefined : e.target.value })}
                >
                  <MenuItem value="">
                    <em>Select Product</em>
                  </MenuItem>
                  {products?.rows.map((prod: any, index: number) => (
                    <MenuItem value={prod.id} key={`product-${index}`}>
                      {prod.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="packaging-select-label">Packaging</InputLabel>
                <Select
                  labelId="packaging-select-label"
                  id="packaging-select"
                  value={product.packagingId}
                  label="Packaging"
                  onChange={(e) => setProduct({ ...product, packagingId: e.target.value === '' ? undefined : e.target.value })}
                >
                  <MenuItem value="">
                    <em>Select Packaging</em>
                  </MenuItem>
                  {packagings?.rows.map((packaging: any, index: number) => (
                    <MenuItem key={`packaging-${index}`} value={packaging.id}>
                      {`${packaging.unitQuantity} ${packaging.unit?.name} (${packaging.unit?.abbreviation})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Allocated {allocationTotal} of {stock?.balPackage ? stock.balPackage : 0} units
            </Typography>
          </Box>

          <Box sx={{ marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              Allocations
              {loadingAllocations && <CircularProgress size={20} sx={{ marginLeft: 1 }} />}
            </Typography>

            <FormControlLabel
              control={<Switch checked={bulkFill} onChange={() => setBulkFill(!bulkFill)} />}
              label="Bulk Fill"
              disabled={allocation?.canBulkFill}
            />

            <Box sx={{ marginTop: 2 }}>
              {allocations?.map((alloc: any, index: number) => (
                <Box key={`allocation-${index}`} sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1">
                      <span>{alloc.index}.</span>
                      <Image
                        className="me-2 mt-1 mb-1"
                        src={sourceImage(alloc.photo)}
                        loader={() => sourceImage(alloc.photo)}
                        alt=""
                        width={TABLE_IMAGE_WIDTH}
                        height={TABLE_IMAGE_HEIGHT}
                      />
                      {alloc.name}
                    </Typography>
                    <TextField
                      type="number"
                      label={`Given away: ${alloc.givenAway}`}
                      variant="outlined"
                      size="small"
                      value={alloc.allocated}
                      onChange={(e) => handleChange(alloc.id, e)}
                      sx={{ width: 100 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAllocate}
            disabled={allocating}
            startIcon={allocating ? <CircularProgress size={20} /> : <Icon icon="mdi:content-save" />}
            sx={{ marginTop: 3 }}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};
