import * as queryString from 'query-string';
import * as React from 'react';
import { match, RouteComponentProps, withRouter } from 'react-router-dom';
import { ILogEntry } from '../interfaces';
import { stringifyLogEntries } from '../util';

const oneDriveRegex = /command:.*:\/Users.*OneDrive/;
const questionMarkBox = (
<div className='log-warning__box-icon'>
  !
</div>);

type LogWarnings = {
  antiVirus: boolean;
  oneDrive: boolean;
  visualCpp: boolean;
}

type LogDataParams = {
  id: string;
}

type OwnProps = {
  match?: match<LogDataParams>;
}

type LogDataProps = OwnProps & RouteComponentProps;

type LogDataState = {
  loading: boolean;
  className?: string;
  /** Text to show in the log. */
  logData: string;
  /** Warnings generated for the log */
  logWarnings?: LogWarnings;
  /** If the "logData" should be displayed as HTML or plain text (defaults to plain text). */
  isLogDataHTML?: boolean;
}

/**
 * Renders the log data.
 *
 * The log output will auto scroll when new log data is added. The auto
 * scrolling is automatically disabled when the user scrolls up, and
 * automatically re-enabled when the user scrolls all the way down.
 */

class LogData extends React.Component<LogDataProps, LogDataState> {
  preNodeRef = React.createRef<HTMLPreElement>();

  constructor(props: any) {
    super(props);
    this.state = {
      className: 'log-page__content',
      logData: 'TEST',
      isLogDataHTML: true,
      loading: true
    }
  }

  /**
   * Ensure that we are scrolled all the way down when the component mounts.
   * This ensures that the latest logs are immediately visible and that auto
   * scroll is immediately active.
   */
  componentDidMount() {
    this.fetchLogData();
  }

  render() {
    const { className, loading, logData, logWarnings, isLogDataHTML } = this.state;
    // Render the log content as html or as plain text
    if (loading) {
      return (
        <h1>Loading Log...</h1>
      );
    }
    const logContent = isLogDataHTML ?
      { dangerouslySetInnerHTML: { __html: logData } } :
      { children: logData };
    const warnings: JSX.Element[] = [];
    if (logWarnings) {
      if (logWarnings.antiVirus) {
        const contents = (
          <div>
            <div className='code'>/Server/router.php</div> is missing. This is most likely due to AntiVirus interference.
            See <a className='wikilink' href='https://bluemaxima.org/flashpoint/datahub/Troubleshooting_Antivirus_Interference'>this link</a> for more information.
          </div>
        );
        warnings.push(warningBox(contents));
      }
      if (logWarnings.oneDrive) {
        const contents = (
          <div>
            Flashpoint appears to be inside your <div className='code'>OneDrive</div> folder.
            This causes issues with the technology, move Flashpoint elsewhere.
          </div>
        );
        warnings.push(warningBox(contents));
      }
      if (logWarnings.visualCpp) {
        const contents = (
          <div>
            You appear to not have <div className='code'>Visual C++ 2015 Redist</div> installed, this may cause issues running games.
            See <a className='wikilink' href='https://bluemaxima.org/flashpoint/datahub/Extended_FAQ#ServerExited'>this link</a> for more information.
          </div>
        );
        warnings.push(warningBox(contents));
      }
    }
    // Render
    return (
      <div className='log-page__wrapper'>
        { warnings.length > 0 ? (
          <div className='log-warnings'>{warnings}</div>
        ) : undefined }
        <pre
          className={(className || '') + ' log simple-scroll'}
          ref={this.preNodeRef}
          { ...logContent } />
      </div>
    );
  }

  async fetchLogData() {
    const raw = this.props.location.search;
    const id = queryString.parse(raw).id;
    const res = await fetch(`logdata?id=${id}`);
    const rawData = await res.json();
    const entries = rawData.entries as ILogEntry[];
    const stringified = stringifyLogEntries(entries);
    const warnings = generateWarnings(entries);
    this.setState({ logData: stringified, logWarnings: warnings, loading: false });
  }
}

function warningBox(contents: JSX.Element): JSX.Element {
  return (
    <div className='log-warning__box'>
      {questionMarkBox}
      <div className='log-warning__box-text'>
        {contents}
      </div>
    </div>
  );
}

function generateWarnings(logEntries: ILogEntry[]): LogWarnings {
  let routerMissing = false;
  let oneDrive = false;
  let visualCpp = false;
  // Initial checks
  for (const entry of logEntries) {
    if (entry.content.includes('Fatal error:  Unknown: Failed opening required \'router.php\'')) {
      routerMissing = true;
    }
    if (oneDriveRegex.test(entry.content)) {
      oneDrive = true;
    }
    if (entry.content.includes('exited with code 3221225781')) {
      visualCpp = true;
    }
  }
  // Figure out outcome
  const warnings: LogWarnings = {
    antiVirus: routerMissing && !oneDrive,
    oneDrive: oneDrive,
    visualCpp: visualCpp,
  }
  return warnings;
}


export default withRouter(LogData);