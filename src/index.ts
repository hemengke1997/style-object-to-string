import type * as CSS from 'csstype'

export interface CSSProperties extends CSS.Properties<string | number> {}

// https://github.com/facebook/react/blob/HEAD/packages/react-dom-bindings/src/shared/hyphenateStyleName.js#L26
/* ------------------- start ------------------ */
const uppercasePattern = /([A-Z])/g
const msPattern = /^ms-/

function hyphenateStyleName(name: string): string {
  return name.replace(uppercasePattern, '-$1').toLowerCase().replace(msPattern, '-ms-')
}
/* -------------------- end ------------------- */

// https://github.com/facebook/react/blob/HEAD/packages/shared/CheckStringCoercion.js#L21-L22
/* ------------------- start ------------------ */
function typeName(value): string {
  const hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag
  const type = (hasToStringTag && value[Symbol.toStringTag]) || value.constructor.name || 'Object'
  return type
}

function testStringCoercion(value) {
  return `${value}`
}

function willCoercionThrow(value): boolean {
  try {
    testStringCoercion(value)
    return false
  } catch (e) {
    return true
  }
}

function checkCSSPropertyStringCoercion(value, propName: string): void | string {
  if (willCoercionThrow(value)) {
    console.error(
      'The provided `%s` CSS property is an unsupported type %s.' +
        ' This value must be coerced to a string before before using it here.',
      propName,
      typeName(value),
    )
    return testStringCoercion(value)
  }
}
/* -------------------- end ------------------- */

// https://github.com/facebook/react/blob/HEAD/packages/react-dom-bindings/src/shared/CSSProperty.js#L11-L12
/* ------------------- start ------------------ */
const isUnitlessNumber = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
}

// https://github.com/facebook/react/blob/HEAD/packages/react-dom-bindings/src/shared/dangerousStyleValue.js#L20
/* ------------------- start ------------------ */
function dangerousStyleValue(name, value, isCustomProperty) {
  const isEmpty = value == null || typeof value === 'boolean' || value === ''
  if (isEmpty) {
    return ''
  }

  if (
    !isCustomProperty &&
    typeof value === 'number' &&
    value !== 0 &&
    // eslint-disable-next-line no-prototype-builtins
    !(isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name])
  ) {
    return `${value}px`
  }

  checkCSSPropertyStringCoercion(value, name)
  return `${value}`.trim()
}
/* -------------------- end ------------------- */

// https://github.com/facebook/react/blob/HEAD/packages/react-dom-bindings/src/client/CSSPropertyOperations.js#L24-L25
/* ------------------- start ------------------ */
function createDangerousStringForStyles(styles: CSSProperties) {
  let serialized = ''
  let delimiter = ''
  for (const styleName in styles) {
    // eslint-disable-next-line no-prototype-builtins
    if (!styles.hasOwnProperty(styleName)) {
      continue
    }
    const styleValue = styles[styleName]
    if (styleValue != null) {
      const isCustomProperty = styleName.indexOf('--') === 0
      serialized += `${delimiter + (isCustomProperty ? styleName : hyphenateStyleName(styleName))}:`
      serialized += dangerousStyleValue(styleName, styleValue, isCustomProperty)

      delimiter = ';'
    }
  }
  return serialized || null
}
/* -------------------- end ------------------- */

function styleObjectToString(style: CSSProperties) {
  return createDangerousStringForStyles(style)
}

export { styleObjectToString }
export default styleObjectToString
