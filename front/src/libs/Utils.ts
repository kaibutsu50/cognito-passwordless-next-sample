function generatePassword (): string {
  const uppercaseNum = 4
  const lowercaseNum = 4
  const numberNum = 3
  const symbolNum = 3
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const number = '0123456789'
  const symbol = '^$*.[]{}()?"!@#%&/\\,><\':;|_~`+='

  let retVal = ''
  retVal += getChars(uppercase, uppercaseNum)
  retVal += getChars(lowercase, lowercaseNum)
  retVal += getChars(number, numberNum)
  retVal += getChars(symbol, symbolNum)
  return shuffle(retVal)

  function getChars (charset: string, length: number): string {
    let result = ''
    for (let i = 0; i < length; ++i) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return result
  }

  function shuffle (string: string): string {
    const array = string.split('')
    let m = array.length
    while (m > 0) {
      const i = Math.floor(Math.random() * m--)
      ;[array[m], array[i]] = [array[i], array[m]]
    }
    return array.join('')
  }
}

export { generatePassword }
