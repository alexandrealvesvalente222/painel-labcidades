/** Ajuste visual do cérebro da splash. */
export const BRAIN_LAYOUT = {
  heightRatio: 0.57,
  stretchX: 0.77,
  stretchY: 0.72,
  left: 0.09,
  centerY: 0.325,
  nodeScale: 0.9,
  lineScale: 0.55,
}

export type BrainLayout = typeof BRAIN_LAYOUT

export const BRAIN_ASPECT = 0.721

export type BrainNode = { x: number; y: number; r: number; c: 'p' | 'o' }

/** Nós normalizados (0–1) extraídos da logo oficial. */
export const BRAIN_NODES: BrainNode[] = [
  { x: 0.5116, y: 0.7941, r: 0.0665, c: 'p' },
  { x: 0.0717, y: 0.3888, r: 0.0654, c: 'p' },
  { x: 0.9349, y: 0.6199, r: 0.0616, c: 'p' },
  { x: 0.4964, y: 0.0877, r: 0.0607, c: 'p' },
  { x: 0.8335, y: 0.8246, r: 0.0597, c: 'p' },
  { x: 0.2317, y: 0.351, r: 0.058, c: 'p' },
  { x: 0.4558, y: 0.5991, r: 0.0571, c: 'p' },
  { x: 0.7386, y: 0.1656, r: 0.0571, c: 'p' },
  { x: 0.0665, y: 0.6958, r: 0.0554, c: 'p' },
  { x: 0.2894, y: 0.7072, r: 0.0544, c: 'p' },
  { x: 0.8614, y: 0.2678, r: 0.0541, c: 'p' },
  { x: 0.3968, y: 0.2453, r: 0.0486, c: 'p' },
  { x: 0.5227, y: 0.318, r: 0.0481, c: 'p' },
  { x: 0.3473, y: 0.0882, r: 0.0475, c: 'p' },
  { x: 0.7504, y: 0.4515, r: 0.0469, c: 'p' },
  { x: 0.0553, y: 0.5485, r: 0.046, c: 'p' },
  { x: 0.9308, y: 0.41, r: 0.045, c: 'p' },
  { x: 0.1775, y: 0.7359, r: 0.0441, c: 'p' },
  { x: 0.5625, y: 0.4873, r: 0.044, c: 'p' },
  { x: 0.7963, y: 0.6694, r: 0.0435, c: 'p' },
  { x: 0.6304, y: 0.0837, r: 0.0433, c: 'p' },
  { x: 0.6051, y: 0.9169, r: 0.0406, c: 'p' },
  { x: 0.2334, y: 0.1746, r: 0.0379, c: 'p' },
  { x: 0.3854, y: 0.8186, r: 0.0379, c: 'p' },
  { x: 0.1493, y: 0.5094, r: 0.0364, c: 'p' },
  { x: 0.6113, y: 0.6148, r: 0.0345, c: 'p' },
  { x: 0.471, y: 0.4455, r: 0.031, c: 'p' },
  { x: 0.7225, y: 0.5856, r: 0.0304, c: 'p' },
  { x: 0.5937, y: 0.7154, r: 0.0292, c: 'p' },
  { x: 0.7723, y: 0.3203, r: 0.0266, c: 'p' },
  { x: 0.3631, y: 0.5947, r: 0.0262, c: 'p' },
  { x: 0.587, y: 0.2093, r: 0.0259, c: 'p' },
  { x: 0.1843, y: 0.6102, r: 0.025, c: 'p' },
  { x: 0.2707, y: 0.458, r: 0.0241, c: 'p' },
  { x: 0.6695, y: 0.9829, r: 0.0217, c: 'p' },
  { x: 0.3642, y: 0.4625, r: 0.0713, c: 'o' },
  { x: 0.6906, y: 0.8061, r: 0.0705, c: 'o' },
  { x: 0.6614, y: 0.3283, r: 0.0568, c: 'o' },
  { x: 0.8431, y: 0.5153, r: 0.0351, c: 'o' },
  { x: 0.1296, y: 0.2387, r: 0.0349, c: 'o' },
]

const DETECTED_EDGES: [number, number][] = [
  [0, 23],
  [0, 28],
  [1, 5],
  [1, 15],
  [2, 4],
  [3, 11],
  [3, 31],
  [4, 19],
  [4, 36],
  [5, 24],
  [5, 33],
  [5, 39],
  [6, 30],
  [6, 35],
  [7, 10],
  [7, 20],
  [7, 29],
  [8, 15],
  [8, 17],
  [8, 24],
  [9, 17],
  [9, 30],
  [10, 16],
  [10, 29],
  [11, 12],
  [11, 13],
  [11, 35],
  [12, 31],
  [13, 22],
  [14, 29],
  [16, 38],
  [17, 32],
  [18, 26],
  [18, 37],
  [19, 38],
  [20, 31],
  [21, 36],
  [25, 27],
  [26, 35],
  [27, 36],
  [28, 36],
  [30, 35],
  [31, 37],
  [33, 35],
  [34, 36],
  [2, 16],
  [2, 38],
  [6, 25],
  [9, 23],
  [12, 18],
  [12, 26],
  [14, 18],
  [14, 27],
  [14, 37],
  [19, 27],
  [21, 34],
  [22, 39],
  [24, 32],
]

function edgeKey(a: number, b: number) {
  return a < b ? `${a}-${b}` : `${b}-${a}`
}

function nearbyEdges(): [number, number][] {
  const seen = new Set(DETECTED_EDGES.map(([a, b]) => edgeKey(a, b)))
  const extra: [number, number][] = []
  for (let i = 0; i < BRAIN_NODES.length; i++) {
    for (let j = i + 1; j < BRAIN_NODES.length; j++) {
      const a = BRAIN_NODES[i]
      const b = BRAIN_NODES[j]
      const d = Math.hypot(a.x - b.x, (a.y - b.y) * BRAIN_ASPECT)
      const gap = d - a.r - b.r
      if (gap >= -0.01 && gap < 0.028 && !seen.has(edgeKey(i, j))) {
        seen.add(edgeKey(i, j))
        extra.push([i, j])
      }
    }
  }
  return extra
}

export const BRAIN_EDGES: [number, number][] = [...DETECTED_EDGES, ...nearbyEdges()]
