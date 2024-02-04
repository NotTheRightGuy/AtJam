import {atom} from 'recoil'
export const phase = atom({
    key:'phase',
    default:{
        current : 'home',
        present: [],
        absent : [],
        presentD2D:[],
        absentD2D:[],
    }
})

