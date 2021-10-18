import { convertToBoolean } from '/@/utils/convert';

export function resolveData(resolve, response) {
  if (convertToBoolean(window.wrapperResponse)) {
    const { data } = response;
    resolve(data)
  } else {
    resolve(response)
  }
}

export function resolveLoginData(resolve, response) {
  if (convertToBoolean(window.wrapperResponse)) {
    resolve(response)
  } else {
    resolve({
      data: response,
      status: 200
    })
  }
}

export function resolveLoginErrorData(resolve, response) {
  if (convertToBoolean(window.wrapperResponse)) {
    resolve(response)
  } else {
    let errorMessage = response.statusText
    debugger
    if (response.data !== '') {
      errorMessage = response.data
    }
    resolve({
      errorMessage: errorMessage,
      status: response.status
    })
  }
}
