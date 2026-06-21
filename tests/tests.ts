import { ConsoleTestRunner } from "./consoleTestRunner";
import * as assertTestTests from "./assertTestTests";
import * as byteListStreamTests from "./byteListStreamTests";
import * as byteListTests from "./byteListTests";
import * as byteTests from "./bytesTests";
import * as characterListStreamTests from "./characterListStreamTests";
import * as characterListTests from "./characterListTests";
import * as characterTableTests from "./CharacterTableTests";
import * as commandLineParametersTests from "./CommandLineParametersTests";
import * as comparerTests from "./comparerTests";
import * as conditionTests from "./conditionTests";
import * as consoleTestRunnerTests from "./consoleTestRunnerTests";
import * as dateTimeTests from "./dateTimeTests";
import * as depthFirstSearchTests from "./depthFirstSearchTests";
import * as disposableTests from "./disposableTests";
import * as englishTests from "./englishTests";
import * as equalFunctionsTests from "./equalFunctionsTests";
import * as fetchHttpClientTests from "./fetchHttpClientTests";
import * as generatorTests from "./generatorTests";
import * as httpClientTests from "./httpClientTests";
import * as indentedCharacterWriteStreamTests from "./IndentedCharacterWriteStreamTests";
import * as indexableTests from "./IndexableTests";
import * as inMemoryCharacterWriteStreamTests from "./inMemoryCharacterWriteStreamTests";
import * as iterableTests from "./iterableTests";
import * as iteratorTests from "./iteratorTests";
import * as javascriptMapMapTests from "./javascriptMapMapTests";
import * as listTests from "./listTests";
import * as mapIteratorTests from "./mapIteratorTests";
import * as mapTests from "./mapTests";
import * as mutableConditionTests from "./mutableConditionTests";
import * as mutableIndexableTests from "./MutableIndexableTests";
import * as mutableMapTests from "./mutableMapTests";
import * as notFoundErrorTests from "./notFoundErrorTests";
import * as postConditionErrorTests from "./postConditionErrorTests";
import * as preConditionErrorTests from "./preConditionErrorTests";
import * as promiseAsyncResultTests from "./promiseAsyncResultTests";
import * as propertyTests from "./propertyTests";
import * as queueTests from "./queueTests";
import * as realHttpServerTests from "./nodeJSHttpServerTests";
import * as recreationDotGovClientTests from "./recreationDotGovClientTests";
import * as setTests from "./setTests";
import * as stackTests from "./stackTests";
import * as stringComparerTests from "./stringComparerTests";
import * as stringIteratorTests from "./stringIteratorTests";
import * as stringsTests from "./stringsTests";
import * as syncResultTests from "./syncResultTests";
import * as testActionTests from "./testActionTests";
import * as testRunnerTests from "./testRunnerTests";
import * as toStringFunctionsTests from "./toStringFunctionsTests";
import * as typesTests from "./typesTests";
import * as whereIteratorTests from "./whereIteratorTests";
import * as wonderlandTrailClientTests from "./wonderlandTrailClientTests";
import * as consoleTestRunnerUITests from "./ConsoleTestRunnerUITests";
import * as basicTestErrorTests from "./BasicTestErrorTests";

export const hasNetworkAccess: boolean = true;

async function tests(): Promise<void>
{
    await ConsoleTestRunner.run([
        assertTestTests,
        byteListStreamTests,
        byteListTests,
        byteTests.test,
        characterListStreamTests,
        characterListTests,
        characterTableTests,
        commandLineParametersTests,
        comparerTests,
        conditionTests,
        consoleTestRunnerTests,
        dateTimeTests,
        depthFirstSearchTests,
        disposableTests,
        englishTests,
        equalFunctionsTests.test,
        fetchHttpClientTests,
        generatorTests,
        httpClientTests,
        indentedCharacterWriteStreamTests,
        indexableTests,
        inMemoryCharacterWriteStreamTests,
        iterableTests,
        iteratorTests,
        javascriptMapMapTests,
        listTests,
        mapIteratorTests,
        mapTests,
        mutableConditionTests,
        mutableIndexableTests,
        mutableMapTests,
        notFoundErrorTests,
        postConditionErrorTests,
        preConditionErrorTests,
        promiseAsyncResultTests.test,
        propertyTests,
        queueTests,
        realHttpServerTests,
        recreationDotGovClientTests,
        setTests,
        stackTests,
        stringComparerTests,
        stringIteratorTests,
        stringsTests,
        syncResultTests,
        testActionTests,
        testRunnerTests,
        toStringFunctionsTests,
        typesTests,
        whereIteratorTests,
        wonderlandTrailClientTests,
        consoleTestRunnerUITests,
        basicTestErrorTests,
    ]);
}

tests();