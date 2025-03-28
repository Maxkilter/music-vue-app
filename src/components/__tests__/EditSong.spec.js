import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import EditSong from "@/components/manage/EditSong.vue";

const mockSong = {
  modifiedName: "Test Song",
  genre: "Pop",
  commentCount: 0,
};

describe("EditSong.vue", () => {
  let wrapper;
  let updateSongMock;
  let updateIsDirtyMock;
  let fetchCurrentUserSongsMock;
  let cancelEditSongMock;

  beforeEach(() => {
    updateSongMock = vi.fn(() => Promise.resolve());
    updateIsDirtyMock = vi.fn();
    fetchCurrentUserSongsMock = vi.fn(() => Promise.resolve());
    cancelEditSongMock = vi.fn();

    wrapper = mount(EditSong, {
      props: {
        song: { ...mockSong },
        cancelEditSong: cancelEditSongMock,
      },
      global: {
        stubs: {
          "vee-form": {
            template:
              "<form @submit.prevent=\"$emit('submit', { modifiedName: 'Updated Song', genre: 'Rock' })\"><slot /></form>",
          },
          "vee-field": {
            template: "<input />",
          },
          ErrorMessage: true,
        },
      },
    });

    wrapper.vm.updateSong = updateSongMock;
    wrapper.vm.updateIsDirty = updateIsDirtyMock;
    wrapper.vm.fetchCurrentUserSongs = fetchCurrentUserSongsMock;
  });

  it("renders with initial song data", () => {
    expect(wrapper.props().song.modifiedName).toBe("Test Song");
  });

  it("calls updateSong and fetchCurrentUserSongs on successful form submission", async () => {
    await wrapper.find("form").trigger("submit.prevent");

    await new Promise((r) => setTimeout(r, 0));

    expect(updateSongMock).toHaveBeenCalledWith({
      modifiedName: "Updated Song",
      genre: "Rock",
    });
    expect(fetchCurrentUserSongsMock).toHaveBeenCalled();
    expect(wrapper.vm.alertVariant).toBe("bg-green-500");
    expect(wrapper.vm.alertMessage).toBe("Successfully updated song information.");
  });

  it("handles errors on form submission", async () => {
    updateSongMock.mockRejectedValueOnce(new Error("Update failed"));
    await wrapper.vm.onEditSong({ modifiedName: "New name", genre: "Jazz" });

    expect(wrapper.vm.inSubmission).toBe(false);
    expect(wrapper.vm.alertVariant).toBe("bg-red-500");
    expect(wrapper.vm.alertMessage).toBe("Error updating song information.");
  });
});
