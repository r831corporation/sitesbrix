"use client"

import { useRef, useEffect, useState } from "react"

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      vx: number
      vy: number
      size: number
      color: string
      alpha: number
    }[] = []

    function createParticles() {
      const particleCount = isMobile ? 100 : 200
      particles = []

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          baseX: Math.random() * canvas.width,
          baseY: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.5 ? "#8da1e0" : "#dadce0",
          alpha: Math.random() * 0.5 + 0.3,
        })
      }
    }

    let animationFrameId: number

    function animate() {
      if (!ctx || !canvas) return

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "#dadce0")
      gradient.addColorStop(1, "#8da1e0")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 150

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Calculate mouse interaction
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          p.x -= Math.cos(angle) * force * 3
          p.y -= Math.sin(angle) * force * 3
        } else {
          p.x += p.vx
          p.y += p.vy
        }

        // Wrap around screen edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1

      animationFrameId = requestAnimationFrame(animate)
    }

    createParticles()
    animate()

    const handleResize = () => {
      updateCanvasSize()
      createParticles()
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-[#dadce0] to-[#8da1e0]">
      <canvas
        ref={canvasRef}
        className="w-full h-full fixed top-0 left-0 touch-none"
        aria-label="Interactive particle background effect"
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex justify-center">
            <img
              src="https://storage.googleapis.com/r831-wordpress/sites/sbrix/Logo-Sbrix.png"
              alt="Sbrix"
              className="w-full max-w-[459px] h-auto"
            />
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">Entre em contato conosco</h1>

            <div className="space-y-4 text-gray-800 leading-relaxed">
              <p>
                Entre em contato conosco e descubra como podemos contribuir diretamente para o que você precisa! Nosso
                compromisso é oferecer um atendimento realmente personalizado, pensado nos mínimos detalhes para atender
                às suas demandas de forma eficaz. Trabalhamos com uma equipe altamente qualificada, pronta para
                orientar, esclarecer dúvidas e apresentar soluções que se encaixem perfeitamente no seu objetivo.
                Combinando conhecimento técnico, experiência prática e uma rede de parceiros confiáveis, criamos
                estratégias exclusivas para cada cliente. Nosso propósito vai além de entregar um bom serviço: buscamos
                construir resultados consistentes e duradouros, fortalecendo cada projeto que passa por nossas mãos.
              </p>

              <p>
                Você pode nos{" "}
                <a
                  href="https://api.whatsapp.com/send?phone=5511983520085"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 underline font-medium transition-colors"
                >
                  encontrar no WhatsApp através do número 11 98352 0085
                </a>
                , ligar para nós pelo telefone 11 3294 1203, ou nos enviar um e-mail para{" "}
                <a
                  href="mailto:vendainterna@sbrix.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 underline font-medium transition-colors"
                >
                  vendainterna@sbrix.com.br
                </a>
                . Estamos ansiosos para ouvir de você e trabalhar juntos para alcançar seus objetivos!
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 py-6 bg-gray-100/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-600 text-sm space-y-1">
              <p>© R831 Comercio e Distribuicao LTDA</p>
              <p>CNPJ: 20.247.512/0001-64</p>
              <p>Rua Ribeiro de Morais, 625 - Vila Albertina - São Paulo, SP</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
