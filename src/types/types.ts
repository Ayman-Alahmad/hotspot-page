export type ArrayToEnum < T extends ReadonlyArray < unknown > > = T extends ReadonlyArray<infer ArrayToEnum>? ArrayToEnum: never
