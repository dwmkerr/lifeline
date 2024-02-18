import { render, screen } from "@testing-library/react";
import LifelinePage from "./LifelinePage";
import { AlertContextProvider } from "../components/AlertContext";
import { DialogContextProvider } from "../components/DialogContext";

test("renders Lifeline header", () => {
  render(
    <AlertContextProvider>
      <DialogContextProvider>
        <LifelinePage />
      </DialogContextProvider>
    </AlertContextProvider>,
  );
  const lifelineElement = screen.getByText(/Lifeline/i);
  expect(lifelineElement).toBeInTheDocument();
});
