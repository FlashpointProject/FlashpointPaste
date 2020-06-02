import { ILogEntry, ArgumentTypesOf } from './interfaces';

const timeChars = 11; // "[HH:MM:SS] "
const sourceChars = 19; // "Background Services" (sometimes used with +2 to add the length of ": ")

/** Create a HTML string of a number of entries */
export function stringifyLogEntries(entries: ILogEntry[], filter: { [key: string]: boolean } = {}): string {
  let str = '';
  let prevEntry: ILogEntry = { source: '', content: '', timestamp: 0 };
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    // Temp fix for array gaps
    if (entry) {
      const entryFilter = filter[entry.source];
      if (entryFilter === true || entryFilter === undefined) {
        str += `<span class="log__time-stamp">[${formatTime(new Date(entry.timestamp))}]</span> `;
        if (entry.source) {
          str += (!prevEntry || entry.source !== prevEntry.source) ?
                `<span class="log__source log__source--${getClassModifier(entry.source)}">${padStart(escapeHTML(entry.source), sourceChars)}:</span> ` :
                ' '.repeat(sourceChars + 2);
        }
        str += padLines(escapeHTML(entry.content), timeChars + sourceChars + 2);
        str += '\n';
      }
    }
    prevEntry = entry;
  }
  return str;
}


/** Formats a date to a string in the format "HH:MM:SS" */
function formatTime(date: Date): string {
  return (
    ('0'+date.getHours()  ).slice(-2)+':'+
    ('0'+date.getMinutes()).slice(-2)+':'+
    ('0'+date.getSeconds()).slice(-2)
  );
}

/** Mak a string safe to use as HTML content (only safe if used as "text" between tags, not inside a tag) */
function escapeHTML(str: string): string {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/**
 * Create a CSS class "modifier" name from the name of a log entry source
 * (it just makes it lower-case, only alphabetical characters and replaces all spaces with "-")
 */
function getClassModifier(source: string): string {
  return (
    source
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z-]/gi, '') // (Only allow a-z and "-")
  );
}

/** Pad all lines (except for the first one) by a number of spaces */
export function padLines(text: string, padding: number): string {
  return text.replace(/\n/g, '\n'+' '.repeat(padding));
}

export function padStart(str: string|number, length: number): string {
  str = str + ''; // (Coerce to string)
  return ' '.repeat(Math.max(0, length - str.length)) + str;
}

/**
 * Check if all properties of both arguments have strictly equals values,
 * and if both objects have identical properties (same number of props with the same names)
 * @param first
 * @param second
 */
export function shallowStrictEquals(first: any, second: any): boolean {
  for (let key in first) {
    if (!(key in second) || first[key] !== second[key]) {
      return false;
    }
  }
  for (let key in second) {
    if (!(key in first) || first[key] !== second[key]) {
      return false;
    }
  }
  return true;
}

type ArgsType = ArgumentTypesOf<typeof stringifyLogEntries>;
export function stringifyLogEntriesEquals(newArgs: ArgsType, prevArgs: ArgsType): boolean {
  return (newArgs[0].length === prevArgs[0].length) && // (Only compare lengths of log entry arrays)
         shallowStrictEquals(newArgs[1], prevArgs[1]); // (Do a proper compare of the filters)
}