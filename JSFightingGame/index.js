const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = 1824
canvas.height = 920

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.89

//Sprite Class with player1 and player2 data and functions
class Sprite
{
    constructor({position, velocity, color = 'red', offset})
    {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 120,
            height: 50
        }
        this.color = color
        this.isAttacking
    }

    //render
    draw()
    {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        //attack box
        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            )
        }
    }

    //update per frame
    update()
    {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.position.y + this.height + this.velocity.y >= canvas.height)
        {
            this.velocity.y = 0
        }
        else
        {
            this.velocity.y += gravity
        }
    }

    //Light Attack
    attack()
    {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }
}


//player1 object
const player1 = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

//player2 object
const player2 = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -70,
        y: 0
    }
})

const keys = {
    a : {
        pressed: false
    },
    d : {
        pressed: false
    },
    ArrowLeft : {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    }
}

//Detect for collison between attackbox and player
function rectangularCollision({ rectangle1, rectangle2})
{
    return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
        )
}

//animation
function animate()
{
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player1.update()
    player2.update()

    player1.velocity.x = 0
    player2.velocity.x = 0

    //player1 movement
    if(keys.a.pressed && player1.lastKey == 'a')
    {
        player1.velocity.x = -5
    }
    else if(keys.d.pressed && player1.lastKey == 'd')
    {
        player1.velocity.x = 5
    }

    //player2 movement
    if(keys.ArrowLeft.pressed && player2.lastKey == 'ArrowLeft')
    {
        player2.velocity.x = -5
    }
    else if(keys.ArrowRight.pressed && player2.lastKey == 'ArrowRight')
    {
        player2.velocity.x = 5
    }

    //Detect collision between player1AttackBox and Player2
    if(rectangularCollision({rectangle1: player1, rectangle2 : player2}) && player1.isAttacking)
    {
        player1.isAttacking = false
        document.querySelector('#enemyHealth').style.width = '20%'
    }

    //Detect collision between player2AttackBox and Player1
    if(rectangularCollision({rectangle1: player2, rectangle2 : player1}) && player2.isAttacking)
    {
        player2.isAttacking = false
        document.querySelector('#playerHealth').style.width = '20%'
    }
}

animate()

//Input Events
window.addEventListener('keydown', (event) => {
    //player1 keyPressed
    switch(event.key)
    {
        case 'd' :
            keys.d.pressed = true
            player1.lastKey = 'd'
            break
        case 'a' :
            keys.a.pressed = true
            player1.lastKey = 'a'
            break
        case 'w' :
            if(player1.velocity.y == 0)
            {
                player1.velocity.y = -20
            }
            break
        case ' ':
            player1.attack()
            break

            //player2 keyPressed
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            player2.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            player2.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            if(player2.velocity.y == 0)
            {
                player2.velocity.y = -20
            }
            break
        case 'ArrowDown' :
            player2.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    //player1 keyup
    switch(event.key)
    {
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break
    }

    //player2 keyup
    switch(event.key)
    {
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break
    }
})