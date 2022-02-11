import { convertToBoolean } from '/@/utils/convert';

export function resolveData(resolve, response) {
  if (convertToBoolean(window.wrapperResponse)) {
    const { result } = response;
    resolve(result)
  } else {
    resolve(response)
  }
}

export function resolveLoginData(resolve, response) {
  if (convertToBoolean(window.wrapperResponse)) {
    resolve(response)
  } else {
    resolve({
      result: response,
      status: 200
    })
  }
}

export function resolveLoginErrorData(resolve, response) {
  if (convertToBoolean(window.wrapperResponse)) {
    resolve(response)
  } else {
    let errorMessage = response.statusText
    if (response.result !== '') {
      errorMessage = response.data
    }
    resolve({
      errorMessage: errorMessage,
      status: response.status
    })
  }
}
