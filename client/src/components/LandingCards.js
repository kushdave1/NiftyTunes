import React from 'react';

import CardGroup from 'react-bootstrap/CardGroup'
import Card from 'react-bootstrap/Card'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function LandingCards() {
  return (
    <Row xs={1} md={4} className="g-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col>
            <Card>
                <Card.Header><i class="bi bi-boombox-fill ms-5"></i></Card.Header>
              <Card.Body>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit longer.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
  );
}

export default LandingCards;
