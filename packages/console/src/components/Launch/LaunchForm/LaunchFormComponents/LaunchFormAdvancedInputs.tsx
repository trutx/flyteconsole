import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Admin } from '@flyteorg/flyteidl-types';
import {
  createGenerateClassName,
  createTheme,
  MuiThemeProvider,
  StylesProvider,
} from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Form from '@rjsf/material-ui';
import validator from '@rjsf/validator-ajv8';
import { State } from 'xstate';
import { LaunchAdvancedOptionsRef } from '../types';
import {
  WorkflowLaunchContext,
  WorkflowLaunchEvent,
  WorkflowLaunchTypestate,
} from '../launchMachine';
import { useStyles } from '../styles';

const muiTheme = createTheme({
  props: {
    MuiTextField: {
      variant: 'outlined',
    },
  },
  overrides: {
    MuiButton: {
      label: {
        color: 'gray',
      },
    },
    MuiCard: {
      root: {
        marginBottom: 16,
        width: '100%',
      },
    },
  },
  typography: {
    h5: {
      fontSize: '.875rem',
      fontWeight: 500,
    },
  },
});

interface LaunchAdvancedOptionsProps {
  state: State<
    WorkflowLaunchContext,
    WorkflowLaunchEvent,
    any,
    WorkflowLaunchTypestate
  >;
}

const isValueValid = (value: any) => {
  return value !== undefined && value !== null;
};

export const LaunchFormAdvancedInputs = forwardRef<
  LaunchAdvancedOptionsRef,
  LaunchAdvancedOptionsProps
>(
  (
    {
      state: {
        context: { launchPlan, ...other },
      },
    },
    ref,
  ) => {
    const styles = useStyles();
    const [labelsParamData, setLabelsParamData] = useState({});
    const [annotationsParamData, setAnnotationsParamData] = useState({});
    const [disableAll, setDisableAll] = useState(false);
    const [maxParallelism, setMaxParallelism] = useState('');
    const [rawOutputDataConfig, setRawOutputDataConfig] = useState('');

    useEffect(() => {
      if (isValueValid(other.disableAll)) {
        setDisableAll(other.disableAll!);
      }
      if (isValueValid(other.maxParallelism)) {
        setMaxParallelism(`${other.maxParallelism}`);
      }
      if (
        other?.rawOutputDataConfig?.outputLocationPrefix !== undefined &&
        other.rawOutputDataConfig.outputLocationPrefix !== null
      ) {
        setRawOutputDataConfig(other.rawOutputDataConfig.outputLocationPrefix);
      }
      const newLabels = {
        ...(other.labels?.values || {}),
        ...(launchPlan?.spec?.labels?.values || {}),
      };
      const newAnnotations = {
        ...(other.annotations?.values || {}),
        ...(launchPlan?.spec?.annotations?.values || {}),
      };
      setLabelsParamData(newLabels);
      setAnnotationsParamData(newAnnotations);
    }, [
      other.disableAll,
      other.maxParallelism,
      other.rawOutputDataConfig,
      other.labels,
      other.annotations,
      launchPlan?.spec,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        getValues: () => {
          return {
            disableAll,
            rawOutputDataConfig: {
              outputLocationPrefix: rawOutputDataConfig,
            },
            maxParallelism: parseInt(maxParallelism || '', 10),
            labels: {
              values: labelsParamData,
            },
            annotations: {
              values: annotationsParamData,
            },
          } as Admin.IExecutionSpec;
        },
        validate: () => {
          return true;
        },
      }),
      [
        disableAll,
        maxParallelism,
        rawOutputDataConfig,
        labelsParamData,
        annotationsParamData,
      ],
    );

    const handleDisableAllChange = useCallback(() => {
      setDisableAll(prevState => !prevState);
    }, []);

    const handleMaxParallelismChange = useCallback(({ target: { value } }) => {
      setMaxParallelism(value);
    }, []);

    const handleLabelsChange = useCallback(({ formData }) => {
      setLabelsParamData(formData);
    }, []);

    const handleAnnotationsParamData = useCallback(({ formData }) => {
      setAnnotationsParamData(formData);
    }, []);

    const handleRawOutputDataConfigChange = useCallback(
      ({ target: { value } }) => {
        setRawOutputDataConfig(value);
      },
      [],
    );

    return (
      <>
        <section title="Labels" className={styles.collapsibleSection}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="Labels"
              id="labels-form"
            >
              <header className={styles.sectionHeader}>
                <Typography variant="h6">Labels</Typography>
              </header>
            </AccordionSummary>

            <AccordionDetails>
              <StylesProvider
                generateClassName={createGenerateClassName({
                  seed: 'AdvancedInput-',
                })}
              >
                <MuiThemeProvider theme={muiTheme}>
                  <Card variant="outlined">
                    <CardContent>
                      <Form
                        schema={{
                          type: 'object',
                          additionalProperties: true,
                        }}
                        formData={labelsParamData}
                        onChange={handleLabelsChange}
                        validator={validator}
                      >
                        <div />
                      </Form>
                    </CardContent>
                  </Card>
                </MuiThemeProvider>
              </StylesProvider>
            </AccordionDetails>
          </Accordion>
        </section>
        <section title="Annotations" className={styles.collapsibleSection}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="Annotations"
              id="annotations-form"
            >
              <header className={styles.sectionHeader}>
                <Typography variant="h6">Annotations</Typography>
              </header>
            </AccordionSummary>

            <AccordionDetails>
              <MuiThemeProvider theme={muiTheme}>
                <Card variant="outlined">
                  <CardContent>
                    <Form
                      schema={{
                        type: 'object',
                        additionalProperties: true,
                      }}
                      formData={annotationsParamData}
                      onChange={handleAnnotationsParamData}
                      validator={validator}
                    >
                      <div />
                    </Form>
                  </CardContent>
                </Card>
              </MuiThemeProvider>
            </AccordionDetails>
          </Accordion>
        </section>
        <section title="Enable/Disable all notifications">
          <FormControlLabel
            control={
              <Checkbox
                checked={disableAll}
                onChange={handleDisableAllChange}
              />
            }
            label="Disable all notifications"
          />
        </section>
        <section title="Raw output data config">
          <TextField
            variant="outlined"
            label="Raw output data config"
            fullWidth
            margin="normal"
            value={rawOutputDataConfig}
            onChange={handleRawOutputDataConfigChange}
          />
        </section>
        <section title="Max parallelism">
          <TextField
            variant="outlined"
            label="Max parallelism"
            fullWidth
            margin="normal"
            value={maxParallelism}
            onChange={handleMaxParallelismChange}
          />
        </section>
      </>
    );
  },
);
