import { NoteInfo } from "../Util";
import { GetAllNoteHeaders, GetNoteInfoFromHeader } from "./Note";
import escapeStringRegexp from "escape-string-regexp";

interface SearchResult{
    note: NoteInfo,
    titleExactMatch?: boolean,
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
        const r:SearchResult={note: note, matchingTitleWordCount: 0 };
        if(note.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())){
            r.titleExactMatch = true;
            results.push(r);
            continue;
        }
        const qwords = query.toLocaleLowerCase().split(' ');
        const twords = note.title.toLocaleLowerCase().split(' ');
        for (const w of qwords){
            for (const t of twords){
                r.matchingTitleWordCount = r.matchingTitleWordCount ?? 0;
                if (w==t) r.matchingTitleWordCount+=1;
            }
        }
        if(r.matchingTitleWordCount==null) r.matchingTitleWordCount=0;
        if(r.matchingTitleWordCount > 0) {results.push(r); continue;}
        if(note.content.includes(query)){
            const escapedQuery = escapeStringRegexp(query);
            const re = new RegExp(escapedQuery, "gi");
            const count = (query.match(re)?.length) ?? 0;
            r.contentExactMatch = true;
            r.contentExactOccurenceCount = count;
            results.push(r);
            continue;
        }
        let cwordmatch = 0;
        for (const w of qwords){
            const escapedWord = escapeStringRegexp(w);
            const re = new RegExp(escapedWord, "gi");
            const count = (query.match(re)?.length) ?? 0;
            cwordmatch+=count;
        }
        r.matchingContentWordCount=cwordmatch;
        results.push(r);
    }
    return results;
}