import { ConsoleTestRunner } from "./consoleTestRunner.js";
import * as assertTestTests from "./assertTestTests.js";
import * as byteListStreamTests from "./byteListStreamTests.js";
import * as byteListTests from "./byteListTests.js";
import * as byteTests from "./bytesTests.js";
import * as characterListStreamTests from "./characterListStreamTests.js";
import * as characterListTests from "./characterListTests.js";
import * as characterTableTests from "./CharacterTableTests.js";
import * as commandLineParametersTests from "./CommandLineParametersTests.js";
import * as comparerTests from "./comparerTests.js";
import * as conditionTests from "./conditionTests.js";
import * as consoleTestRunnerTests from "./consoleTestRunnerTests.js";
import * as dateTimeTests from "./dateTimeTests.js";
import * as depthFirstSearchTests from "./depthFirstSearchTests.js";
import * as syncDisposableTests from "./SyncDisposableTests.js";
import * as englishTests from "./englishTests.js";
import * as equalFunctionsTests from "./equalFunctionsTests.js";
import * as fetchHttpClientTests from "./fetchHttpClientTests.js";
import * as generatorTests from "./generatorTests.js";
import * as httpClientTests from "./httpClientTests.js";
import * as indentedCharacterWriteStreamTests from "./IndentedCharacterWriteStreamTests.js";
import * as indexableTests from "./IndexableTests.js";
import * as inMemoryCharacterWriteStreamTests from "./inMemoryCharacterWriteStreamTests.js";
import * as iterableTests from "./iterableTests.js";
import * as iteratorTests from "./iteratorTests.js";
import * as javascriptMapMapTests from "./javascriptMapMapTests.js";
import * as listTests from "./listTests.js";
import * as mapIteratorTests from "./mapIteratorTests.js";
import * as mapTests from "./mapTests.js";
import * as mutableConditionTests from "./mutableConditionTests.js";
import * as mutableIndexableTests from "./MutableIndexableTests.js";
import * as mutableMapTests from "./mutableMapTests.js";
import * as notFoundErrorTests from "./notFoundErrorTests.js";
import * as postConditionErrorTests from "./postConditionErrorTests.js";
import * as preConditionErrorTests from "./preConditionErrorTests.js";
import * as promiseAsyncResultTests from "./promiseAsyncResultTests.js";
import * as propertyTests from "./propertyTests.js";
import * as queueTests from "./queueTests.js";
import * as realHttpServerTests from "./nodeJSHttpServerTests.js";
import * as recreationDotGovClientTests from "./recreationDotGovClientTests.js";
import * as setTests from "./setTests.js";
import * as stackTests from "./stackTests.js";
import * as stringComparerTests from "./stringComparerTests.js";
import * as stringIteratorTests from "./stringIteratorTests.js";
import * as stringsTests from "./stringsTests.js";
import * as syncResultTests from "./syncResultTests.js";
import * as testActionTests from "./testActionTests.js";
import * as testRunnerTests from "./testRunnerTests.js";
import * as toStringFunctionsTests from "./toStringFunctionsTests.js";
import * as typesTests from "./typesTests.js";
import * as whereIteratorTests from "./whereIteratorTests.js";
import * as wonderlandTrailClientTests from "./wonderlandTrailClientTests.js";
import * as consoleTestRunnerUITests from "./ConsoleTestRunnerUITests.js";
import * as basicTestErrorTests from "./BasicTestErrorTests.js";
import * as tokenizerTests from "./TokenizerTests.js";
import * as clockTests from "./ClockTests.js";
import * as temperatureUnitsTests from "./TemperatureUnitsTests.js";
import * as temperatureTests from "./TemperatureTests.js";
import * as fakeHttpClientTests from "./FakeHttpClientTests.js";
import * as fakeLoggerTests from "./FakeLoggerTests.js";
import * as fakeClockTests from "./FakeClockTests.js";
import * as jsonTests from "./JSONTests.js";
import * as logLevelTests from "./LogLevelTests.js";
import * as httpOutgoingRequestTests from "./HttpOutgoingRequestTests.js";
import * as asyncDisposableTests from "./AsyncDisposableTests.js";

export const hasNetworkAccess: boolean = true;

ConsoleTestRunner.run([
    assertTestTests,
    basicTestErrorTests,
    byteListStreamTests,
    byteListTests,
    byteTests,
    characterListStreamTests,
    characterListTests,
    commandLineParametersTests,
    comparerTests,
    conditionTests,
    consoleTestRunnerTests,
    consoleTestRunnerUITests,
    dateTimeTests,
    depthFirstSearchTests,
    syncDisposableTests,
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
    characterTableTests,
    tokenizerTests,
    clockTests,
    temperatureUnitsTests,
    temperatureTests,
    fakeHttpClientTests,
    fakeLoggerTests,
    fakeClockTests,
    jsonTests,
    logLevelTests,
    httpOutgoingRequestTests,
    asyncDisposableTests,
]);