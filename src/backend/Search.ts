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
    let headers = await GetAllNoteHeaders();
    let notes: NoteInfo[]=[];
    let results:SearchResult[]=[];
    for (let h of headers){
        let n = await GetNoteInfoFromHeader(h);
        notes.push(n);
    }
    for (let note of notes){
        let r:SearchResult={note: note, matchingTitleWordCount: 0 };
        if(note.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())){
            r.titleExactMatch = true;
            results.push(r);
            continue;
        }
        let qwords = query.toLocaleLowerCase().split(' ');
        let twords = note.title.toLocaleLowerCase().split(' ');
        for (let w of qwords){
            for (let t of twords){
                r.matchingTitleWordCount = r.matchingTitleWordCount ?? 0;
                if (w==t) r.matchingTitleWordCount+=1;
            }
        }
        if(r.matchingTitleWordCount==null) r.matchingTitleWordCount=0;
        if(r.matchingTitleWordCount > 0) {results.push(r); continue;}
        if(note.content.includes(query)){
            let escapedQuery = escapeStringRegexp(query);
            let re = new RegExp(escapedQuery, "gi");
            let count = (query.match(re)?.length) ?? 0;
            r.contentExactMatch = true;
            r.contentExactOccurenceCount = count;
            results.push(r);
            continue;
        }
        let cwordmatch = 0;
        for (let w of qwords){
            let escapedWord = escapeStringRegexp(w);
            let re = new RegExp(escapedWord, "gi");
            let count = (query.match(re)?.length) ?? 0;
            cwordmatch+=count;
        }
        r.matchingContentWordCount=cwordmatch;
        results.push(r);
    }
    return results;
}