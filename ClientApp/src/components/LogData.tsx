import * as React from 'react';
import { RouteProps, match, withRouter, RouteComponentProps } from 'react-router-dom';
import { stringifyLogEntries } from '../util';
import { ILogEntry } from '../interfaces';
import * as queryString from 'query-string';

type LogDataSnapshot = {
  scrolledToBottom: boolean;
};

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
    const { className, loading, logData, isLogDataHTML } = this.state;
    // Render the log content as html or as plain text
    if (loading) {
      return (
        <p>LOADING</p>
      );
    }
    const logContent = isLogDataHTML ?
      { dangerouslySetInnerHTML: { __html: logData } } :
      { children: logData };
    // Render
    return (
      <pre
        className={(className || '') + ' log simple-scroll'}
        ref={this.preNodeRef}
        { ...logContent } />
    );
  }

  async fetchLogData() {
    const raw = this.props.location.search;
    const id = queryString.parse(raw).id;
    const res = await fetch(`logdata?id=${id}`);
    const rawData = await res.json();
    const stringified = stringifyLogEntries(rawData.entries as ILogEntry[]);
    this.setState({ logData: stringified, loading: false });
  }
}

export default withRouter(LogData);