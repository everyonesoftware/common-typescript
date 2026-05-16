import { ConsoleTestRunner } from "./consoleTestRunner";
import * as assertTestTests from "./assertTestTests";
import * as byteListStreamTests from "./byteListStreamTests";
import * as byteListTests from "./byteListTests";
import * as byteTests from "./bytesTests";
import * as characterListStreamTests from "./characterListStreamTests";
import * as characterListTests from "./characterListTests";
import * as comparerTests from "./comparerTests";
import * as conditionTests from "./conditionTests";
import * as consoleTestRunner2Tests from "./consoleTestRunnerTests";
import * as dateTimeTests from "./dateTimeTests";
import * as depthFirstSearchTests from "./depthFirstSearchTests";
import * as disposableTests from "./disposableTests";
import * as englishTests from "./englishTests";
import * as equalFunctionsTests from "./equalFunctionsTests";
import * as fetchHttpClientTests from "./fetchHttpClientTests";
import * as generatorTests from "./generatorTests";
import * as httpClientTests from "./httpClientTests";
import * as inMemoryCharacterWriteStreamTests from "./inMemoryCharacterWriteStreamTests";
import * as iterableTests from "./iterableTests";
import * as iteratorTests from "./iteratorTests";
import * as javascriptMapMapTests from "./javascriptMapMapTests";
import * as listTests from "./listTests";
import * as mapIteratorTests from "./mapIteratorTests";
import * as mapTests from "./mapTests";
import * as mutableConditionTests from "./mutableConditionTests";
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

export const hasNetworkAccess: boolean = true;

await ConsoleTestRunner.run([
    assertTestTests,
    promiseAsyncResultTests.test,
    byteTests.test,
    comparerTests,
    conditionTests,
    consoleTestRunner2Tests,
    dateTimeTests,
    disposableTests,
    englishTests,
    equalFunctionsTests.test,
    fetchHttpClientTests,
    generatorTests,
    httpClientTests,
    inMemoryCharacterWriteStreamTests,
    iterableTests,
    iteratorTests,
    javascriptMapMapTests,
    listTests,
    mapIteratorTests,
    mapTests,
    mutableConditionTests,
    mutableMapTests,
    notFoundErrorTests,
    postConditionErrorTests,
    preConditionErrorTests,
    propertyTests,
    queueTests,
    realHttpServerTests,
    recreationDotGovClientTests,
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
    setTests,
    depthFirstSearchTests,
    byteListTests,
    byteListStreamTests,
    characterListTests,
    characterListStreamTests,
]);