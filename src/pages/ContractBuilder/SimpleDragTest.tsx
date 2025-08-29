import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';

const SimpleDragTest: React.FC = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Simple Drag Test</Typography>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <Paper 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              sx={{ p: 2, minHeight: 200 }}
            >
              {items.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        mb: 1,
                        backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                        cursor: 'grab'
                      }}
                    >
                      <CardContent>
                        <Typography>{item}</Typography>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default SimpleDragTest;
