import React from 'react'

function Cards(props) {
    const dragStart = e => {
        const target = e.target
        console.log(target.id)
        e.dataTransfer.setData('card_id', target.id); 

        
    }

    const dragOver = e => {
        e.stopPropagation();
    }

    return (
        <div
        id={props.id}
        className={props.className}
        draggable={props.draggable}
        onDragStart={dragStart}
        onDragOver={dragOver}
        >
            {props.children}
        </div>
    )
}

export default Cards