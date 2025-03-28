import AboutView from "@/views/AboutView.vue";
import { shallowMount } from "@vue/test-utils";

describe("AboutView.vue", () => {
  it("should render inner text", () => {
    const wrapper = shallowMount(AboutView);

    expect(wrapper.text()).toContain("This is an about page");
  });
});
