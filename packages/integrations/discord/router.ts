import { openModalResponse, pongResponse } from "./responses";
import { handleModalSubmit } from "./submits";

/**
 * Routes Discord interactions to the correct handler.
 * - PING => PONG
 * - APPLICATION_COMMAND => open modal
 * - MODAL_SUBMIT => write to CD2_OPS via internal APIs
 */
export async function routeInteraction(interaction: any) {
  // PING
  if (interaction.type === 1) return pongResponse();

  // APPLICATION_COMMAND
  if (interaction.type === 2) {
    const name = interaction?.data?.name;
    return openModalResponse(name);
  }

  // MODAL_SUBMIT
  if (interaction.type === 5) {
    return await handleModalSubmit(interaction);
  }

  return { type: 4, data: { content: "Unsupported interaction type." } };
}
