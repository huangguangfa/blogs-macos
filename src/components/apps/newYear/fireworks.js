
export class Firework {
    // 起始点坐标sx,sy 目标点坐标tx,ty
    constructor(sx, sy, tx, ty, ctx) {
        this.ctx = ctx;
        // 当前坐标
        this.x = sx
        this.y = sy
        // 起始点坐标
        this.sx = sx
        this.sy = sy
        // 目标点坐标
        this.tx = tx
        this.ty = ty

        // 起始点到目标点的距离
        this.distanceToTarget = calcPointsDistance(sx, sy, tx, ty)
        // 移动后的距离
        this.distanceTraveled = 0

        // 烟花的轨迹坐标
        this.coords = [
            [this.x, this.y],
        ]

        // Math.atan2是计算某点到原点0,0与x正轴的弧度值，传入y,x
        // 难点：看原理/向量坐标的关系.png 目标点向量为两个点的向量相加 已经有了起始点 那就求出另一个点
        // 求出弧度后为了update中分解为vx,vy服务
        this.angle = Math.atan2(ty - sy, tx - sx)
        this.speed = 2 // 基础移动速度为2
        this.acceleration = 1.05 // 加速度系数
        this.hue = randomRange(0, 360)
        this.brightness = randomRange(50, 70) // 随机亮度
    }

    // 更新某个烟花属性（烟花移动是加速度的）
    update(index) {
        // 删掉最后一项 在最前面塞入一项
        this.coords.pop()
        this.coords.unshift([this.x, this.y])

        this.speed *= this.acceleration // 进行加速度

        const vx = Math.cos(this.angle) * this.speed
        const vy = Math.sin(this.angle) * this.speed

        // 计算出移动后的距离
        this.distanceTraveled = calcPointsDistance(this.sx, this.sy, this.x + vx, this.y + vy)

        // 如果移动到目标点 就创建50个爆炸粒子对象，并删除这个射出的烟火对象
        // 否则继续更新this.x,this.y
        if (this.distanceTraveled >= this.distanceToTarget) {
            for (let i = 0; i < 75; i++) {
                particles.push(new Particle(this.tx, this.ty, this.hue))
            }

            fireworks.splice(index, 1)
        } else {
            this.x += vx
            this.y += vy
        }
    }

    // 绘制烟火
    draw() {
        this.ctx.beginPath()
        const [startX, startY] = this.coords[this.coords.length - 1]
        this.ctx.moveTo(startX, startY)
        this.ctx.lineTo(this.x, this.y)
        this.ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, 60%` // 仅亮度会变化
        this.ctx.lineWidth = 1
        this.ctx.stroke()
    }
}