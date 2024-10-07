import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/* [If URL param already provided =>] change UI's de-s value => change s value in URL [=> delete param if equal to default] */
export default function useQueryParam({
  paramKey,
  setter = (v) => v,
  serialize = encodeURI,
  deserialize = decodeURI,
  defaultValue = null,
}) {
  const [params, setParams] = useSearchParams()
  const param = params.get(paramKey)
  const setParam = (v) => setParams((qps) => ({ ...qps, [paramKey]: serialize(v) }))
  const deleteParam = () =>
    setParams((qps) => {
      qps.delete(paramKey)
      return qps
    })

  const _setAsDeserialized = (v) => setter(deserialize(v))
  const [value, _setValue] = useState(_setAsDeserialized(param || defaultValue))
  const setValue = (v) => _setValue(_setAsDeserialized(v))

  useEffect(() => {
    // Delete param if equal to default
    const isDefaultValue = param === deserialize(defaultValue)
    if (param || isDefaultValue) setValue(param)
    if (isDefaultValue) return deleteParam()
  }, [param])

  return [value, setParam]
}
