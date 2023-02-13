describe("smoke tests", () => {
  it("should allow you to see the score index and my scores", () => {
    cy.visitAndCheck("/scores");

    cy.findByRole("link", { name: /try looking up Cathadan/i }).click();

    cy.findByText(/Hyper Hyper/i).should("exist");
  });
});
