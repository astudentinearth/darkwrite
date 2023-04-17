import { SearchNotes } from "./Search";

/** Wrapper for developer console */
export async function TestSearch(q: string){
    let results = await SearchNotes(q);
    let outstr = "Query: '"+q+"'\n";
    outstr += "Title                    | Title Exact Match | Content Exact Match | Content Exact Occurences | Content Words Matched | Title Words Matched\n";
    for (let r of results){
        outstr+=`${r.note.title.substring(0,24).padEnd(24,' ')} | ${r.titleExactMatch} | ${r.contentExactMatch} | ${r.contentExactOccurenceCount} | ${r.matchingContentWordCount} | ${r.matchingTitleWordCount}\n`
    }
    return outstr;
}