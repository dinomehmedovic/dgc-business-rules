/**
 * Map a JS function over all DGC payloads in the dgc-testdata repo,
 * which is assumed to exist right next to this dgc-business-rules repo.
 */


import { PathLike } from "fs"
const readdirRecursive = require("fs-readdir-recursive")
import { join } from "path"

import { readJson } from "./file-utils"


export interface MapResult<RT> {
    file: PathLike
    notJson?: boolean
    result?: RT
}

function mapTestFile<RT>(path: PathLike, func: (dgc: any) => RT): MapResult<RT> {
    const testJson = readJson(path)
    if (!testJson) {
        return {
            file: path,
            notJson: true
        }
    }
    const dgc = testJson.JSON
    return {
        file: path,
        result: func(dgc)
    }
}

const testDataPath = join(__dirname, "../../../dgc-testdata")
const testFiles = readdirRecursive(testDataPath).filter((path: string) => path.match(/\/raw\/\d+\.json$/))


type MapResults<RT> = MapResult<RT>[]

/**
 * Map the given `func` on all DGC payloads in the dgc-testdata repo,
 * gathering the results as a {@see MapResults}.
 */
export function mapTestFiles<RT>(func: (dgc: any) => RT): MapResults<RT> {
    return testFiles.map((path: string) => mapTestFile(join(testDataPath, path), func))
}
