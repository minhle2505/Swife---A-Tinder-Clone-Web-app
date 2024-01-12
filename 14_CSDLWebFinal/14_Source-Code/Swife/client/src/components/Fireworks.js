import React, { useEffect, useRef } from 'react'

const Fireworks = ({ show, positionX, positionY }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (show) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const width = 600;
      const height = 400
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#FFF'; 

      const fireworks = [];
      const particles = [];

      class Firework {
        constructor() {
          this.x = positionX !== undefined ? positionX : Math.random() * width;
          this.y = positionY !== undefined ? positionY : height;
          this.color = '#FFF';
          this.radius = Math.random() * 8 + 2; // Tăng kích thước pháo hoa
          this.velocity = Math.random() * 5 + 1; // Tăng tốc độ pháo hoa
          this.opacity = 1;
        }

        draw() {
          ctx.globalCompositeOperation = 'lighter';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        update() {
          this.y -= this.velocity;
          if (this.opacity > 0) {
            this.opacity -= 0.02; // Giảm tốc độ biến mất
          }
        }
      }

      function createParticles(x, y) {
        for (let i = 0; i < 15; i++) { // Giảm số lượng pháo hoa
          const particle = new Firework();
          particle.x = x;
          particle.y = y;
          particle.color = '#FFF';
          particles.push(particle);
        }
      }

      function animate() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Điều chỉnh mức độ trong suốt của canvas
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        fireworks.forEach((firework, index) => {
          firework.draw();
          firework.update();
          if (firework.opacity <= 0) {
            fireworks.splice(index, 1);
            createParticles(firework.x, firework.y);
          }
        });

        particles.forEach((particle, index) => {
          particle.draw();
          particle.update();
          if (particle.opacity <= 0) {
            particles.splice(index, 1);
          }
        });

        requestAnimationFrame(animate);
      }

      function createFirework() {
        const firework = new Firework();
        fireworks.push(firework);
      }

      const fireworksInterval = setInterval(createFirework, 300); // Điều chỉnh thời gian giữa mỗi lần xuất hiện pháo hoa
      animate();

      return () => clearInterval(fireworksInterval);
    }
  }, [show, positionX, positionY]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />;
};

export default Fireworks;
