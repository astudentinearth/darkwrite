import { SearchNotes, SortSearchResults } from "./Search";

/** Wrapper for developer console */
export async function TestSearch(q: string){
    const results = await SearchNotes(q);
    const sorted = SortSearchResults(results);
    let outstr = "Query: '"+q+"'\n";
    outstr += "Raw: \nTitle                    | Title Exact Match | Content Exact Match | Content Exact Occurences | Content Words Matched | Title Words Matched\n";
    for (const r of results){
        outstr+=`${r.note.title.substring(0,24).padEnd(24,' ')} | ${r.titleExactMatch} | ${r.contentExactMatch} | ${r.contentExactOccurenceCount} | ${r.matchingContentWordCount} | ${r.matchingTitleWordCount}\n`
    }
    outstr+="Sorted: \n"
    for (const r of sorted){
        outstr+=`${r.note.title.substring(0,24).padEnd(24,' ')} | ${r.titleExactMatch} | ${r.contentExactMatch} | ${r.contentExactOccurenceCount} | ${r.matchingContentWordCount} | ${r.matchingTitleWordCount}\n`
    }
    return outstr;
}