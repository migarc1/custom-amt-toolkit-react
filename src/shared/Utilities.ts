/*********************************************************************
 * Copyright (c) Intel Corporation 2019
 * SPDX-License-Identifier: Apache-2.0
 **********************************************************************/

/** utility function to join the css class names */
export const joinClasses = (...classNames: (string | undefined | null | false)[]): string =>
  classNames.filter(Boolean).join(' ').trim()

export const prepareHeaders = (): HeadersInit => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

export const isFalsy = (value: unknown): boolean => value != null && value !== '' && value !== false && value !== 0