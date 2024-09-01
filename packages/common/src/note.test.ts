import { Note, resolveDescendants, resolveParents } from "./note"

const notes: Note[] = [
    {
        id: "lvl1",
        title: "a",
        icon: "",
        created: new Date(),
        modified: new Date(),
        parentID: undefined
    },
    {
        id: "lvl2",
        title: "a",
        icon: "",
        created: new Date(),
        modified: new Date(),
        parentID: "lvl1"
    },
    {
        id: "lvl2_1",
        title: "a",
        icon: "",
        created: new Date(),
        modified: new Date(),
        parentID: "lvl1"
    },
    {
        id: "lvl2_2",
        title: "a",
        icon: "",
        created: new Date(),
        modified: new Date(),
        parentID: "lvl1"
    },
    {
        id: "asd",
        title: "a",
        icon: "",
        created: new Date(),
        modified: new Date(),
        parentID: "unrelated"
    },
    {
        id: "lvl3",
        title: "a",
        icon: "",
        created: new Date(),
        modified: new Date(),
        parentID: "lvl2_1"
    }
]

it("should search down the tree for notes", ()=>{
    const descendants = resolveDescendants("lvl1", notes);
    console.log(descendants)
    expect(descendants.findIndex(n=>n.id==="asd")).toBe(-1);
    expect(descendants.findIndex(n=>n.id==="lvl2")).not.toBe(-1);
    expect(descendants.findIndex(n=>n.id==="lvl2_1")).not.toBe(-1);
    expect(descendants.findIndex(n=>n.id==="lvl2_2")).not.toBe(-1);
    expect(descendants.findIndex(n=>n.id==="lvl3")).not.toBe(-1);
})

it("should search up the tree for notes", ()=>{
    const parents = resolveParents("lvl3", notes);
    expect(parents.findIndex(n=>n.id==="lvl2_1")).not.toBe(-1);
    expect(parents.findIndex(n=>n.id==="lvl1")).not.toBe(-1);
    expect(parents.findIndex(n=>n.id==="asd")).toBe(-1);
    expect(parents.findIndex(n=>n.id==="lvl2")).toBe(-1);
})