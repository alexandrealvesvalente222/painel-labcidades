/** Fundo tech CSS: binário + cérebro em nós + fluxo de dados */
export default function TechBackground() {
  return (
    <div className="tech-background" aria-hidden="true">
      <div className="binary binary-left">
        01001101 10101010 01010101 11001010
        <br />
        10100110 01101001 10101010 01010101
        <br />
        01010101 11001010 10100110 01101001
        <br />
        10101010 01010101 11001010 10100110
        <br />
        01010101 11001010 10100110 01101001
        <br />
        10101010 01010101 11001010 10100110
        <br />
        01101001 10101010 01010101 11001010
        <br />
        10100110 01101001 10101010 01010101
      </div>

      <div className="brain">
        <div className="line l1" />
        <div className="line l2" />
        <div className="line l3" />
        <div className="line l4" />
        <div className="line l5" />
        <div className="line l6" />
        <div className="line l7" />
        <div className="line l8" />

        <div className="node n1" />
        <div className="node n2" />
        <div className="node n3 orange" />
        <div className="node n4" />
        <div className="node n5" />
        <div className="node n6" />
        <div className="node n7 orange" />
        <div className="node n8" />
        <div className="node n9" />
        <div className="node n10" />
        <div className="node n11 orange" />
        <div className="node n12" />
        <div className="node n13" />
        <div className="node n14" />
      </div>

      <div className="data-line d1" />
      <div className="data-line d2" />
      <div className="data-line d3" />
      <div className="data-line d4" />
      <div className="data-line d5" />

      <span className="data-bit b1">0</span>
      <span className="data-bit b2">1</span>
      <span className="data-bit b3">1</span>
      <span className="data-bit b4">0</span>
      <span className="data-bit b5">1</span>
      <span className="data-bit b6">0</span>
      <span className="data-bit b7">1</span>
      <span className="data-bit b8">0</span>
    </div>
  )
}
