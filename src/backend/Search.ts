import { NoteInfo } from "../Util";
import { GetAllNoteHeaders, GetNoteInfoFromHeader } from "./Note";
import escapeStringRegexp from "escape-string-regexp";

export interface SearchResult{
    note: NoteInfo,
    titleExactMatch?: boolean, // unused
    matchingTitleWordCount?: number,
    contentExactMatch?: boolean,
    contentExactOccurenceCount?: number,
    matchingContentWordCount?: number
}

export async function SearchNotes(query: string){
    const headers = await GetAllNoteHeaders();
    const notes: NoteInfo[]=[];
    const results:SearchResult[]=[];
    for (const h of headers){
        const n = await GetNoteInfoFromHeader(h);
        notes.push(n);
    }
    for (const note of notes){
        //if(results.length > 15 && !removeResultCap) continue;
        const r:SearchResult={note: note, matchingTitleWordCount: 0 };
        if(note.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())){
            r.titleExactMatch = true;
        }
        const qwords = query.toLocaleLowerCase().split(' ');
        const twords = note.title.toLocaleLowerCase().split(' ');
        for (const w of qwords){
            for (const t of twords){
                r.matchingTitleWordCount = r.matchingTitleWordCount ?? 0;
                if (t.includes(w)) r.matchingTitleWordCount+=1;
            }
        }
        if(r.matchingTitleWordCount==null) r.matchingTitleWordCount=0;
        if(r.matchingTitleWordCount > 0) {results.push(r); continue;}
        if(note.content.includes(query)){
            const escapedQuery = escapeStringRegexp(query);
            const re = new RegExp(escapedQuery, "gi");
            const count = (note.content.match(re)?.length) ?? 0;
            r.contentExactMatch = true;
            r.contentExactOccurenceCount = count;
        }
        let cwordmatch = 0;
        for (const w of qwords){
            const escapedWord = escapeStringRegexp(w);
            const re = new RegExp(escapedWord, "gi");
            const count = (note.content.match(re) || []).length;
            cwordmatch+=count;
        }
        r.matchingContentWordCount=cwordmatch;
        results.push(r);
    }
    return results;
}

export function SortSearchResults(results: SearchResult[]) : SearchResult[]{
    const newresults: SearchResult[] = [];
    // Title word matches
    const titlewordmatches: SearchResult[] = [];
    results.map((x)=>{if((x.matchingTitleWordCount ?? 0)>0){ titlewordmatches.push(x)}});
    const sortedtitlewordmatches = titlewordmatches.sort((a,b)=>{return (b.matchingTitleWordCount ?? 0)-(a.matchingTitleWordCount ?? 0)})
    sortedtitlewordmatches.map((x)=>{newresults.push(x)});
    const contentmatches: SearchResult[] = []
    results.map((x)=>{if(!newresults.includes(x) && (x.matchingContentWordCount ?? 0) > 0) contentmatches.push(x)})
    const sortedcontentmatches = contentmatches.sort((a,b)=>{return (b.matchingContentWordCount ?? 0)-(a.matchingContentWordCount ?? 0)})
    sortedcontentmatches.map(x=>{newresults.push(x)});
    return newresults
}