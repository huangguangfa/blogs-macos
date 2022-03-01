// type TestType<Name extends string, Age extends number> = () => 
function createPerson(ctor) {
    return new ctor('guang', 18);
}
