import type {
  RecallIncident,
  RecallSeverity,
  RecallStatus,
  RemedyType,
} from './recall-schema'

export type RecallAction =
  | { type: 'SET_FIELD'; path: readonly string[]; value: unknown }
  | { type: 'SET_SEVERITY'; value: RecallSeverity }
  | { type: 'SET_STATUS'; value: RecallStatus }
  | { type: 'SET_REMEDY_TYPE'; value: RemedyType }
  | { type: 'ADD_BATCH'; value: string }
  | { type: 'REMOVE_BATCH'; index: number }
  | { type: 'UPDATE_BATCH'; index: number; value: string }
  | { type: 'ADD_STEP'; value: string }
  | { type: 'REMOVE_STEP'; index: number }
  | { type: 'UPDATE_STEP'; index: number; value: string }
  | { type: 'REORDER_STEPS'; from: number; to: number }
  | { type: 'RESET'; incident: RecallIncident }

function setNestedField(
  obj: Record<string, unknown>,
  path: readonly string[],
  value: unknown,
): Record<string, unknown> {
  if (path.length === 0) return obj
  if (path.length === 1) {
    return { ...obj, [path[0]]: value }
  }
  return {
    ...obj,
    [path[0]]: setNestedField(
      obj[path[0]] as Record<string, unknown>,
      path.slice(1),
      value,
    ),
  }
}

function reorder<T>(list: T[], from: number, to: number): T[] {
  const result = [...list]
  const [item] = result.splice(from, 1)
  result.splice(to, 0, item)
  return result
}

export function recallReducer(
  state: RecallIncident,
  action: RecallAction,
): RecallIncident {
  switch (action.type) {
    case 'SET_FIELD': {
      const now = new Date().toISOString().slice(0, 19)
      const updated = setNestedField(
        state as unknown as Record<string, unknown>,
        action.path,
        action.value,
      ) as unknown as RecallIncident
      if (
        action.path.length === 2 &&
        action.path[0] === 'action' &&
        action.path[1] === 'returnInstructions' &&
        typeof action.value === 'string'
      ) {
        return {
          ...updated,
          company: { ...updated.company, returnInstructions: action.value },
          updatedAt: now,
        }
      }
      return { ...updated, updatedAt: now }
    }
    case 'SET_SEVERITY':
      return { ...state, severity: action.value, updatedAt: new Date().toISOString().slice(0, 19) }
    case 'SET_STATUS':
      return { ...state, status: action.value, updatedAt: new Date().toISOString().slice(0, 19) }
    case 'SET_REMEDY_TYPE':
      return {
        ...state,
        action: { ...state.action, remedyType: action.value },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'ADD_BATCH':
      return {
        ...state,
        product: {
          ...state.product,
          affectedBatches: [...state.product.affectedBatches, action.value],
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'REMOVE_BATCH':
      return {
        ...state,
        product: {
          ...state.product,
          affectedBatches: state.product.affectedBatches.filter(
            (_, i) => i !== action.index,
          ),
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'UPDATE_BATCH':
      return {
        ...state,
        product: {
          ...state.product,
          affectedBatches: state.product.affectedBatches.map((b, i) =>
            i === action.index ? action.value : b,
          ),
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'ADD_STEP':
      return {
        ...state,
        action: {
          ...state.action,
          steps: [...state.action.steps, action.value],
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'REMOVE_STEP':
      return {
        ...state,
        action: {
          ...state.action,
          steps: state.action.steps.filter((_, i) => i !== action.index),
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'UPDATE_STEP':
      return {
        ...state,
        action: {
          ...state.action,
          steps: state.action.steps.map((s, i) =>
            i === action.index ? action.value : s,
          ),
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'REORDER_STEPS':
      return {
        ...state,
        action: {
          ...state.action,
          steps: reorder(state.action.steps, action.from, action.to),
        },
        updatedAt: new Date().toISOString().slice(0, 19),
      }
    case 'RESET':
      return action.incident
  }
}
