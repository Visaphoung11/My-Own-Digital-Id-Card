"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  gender: z.enum(["male", "female"]),
  nationality: z.string().min(1),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  bio: z.string().min(1),
  web_site: z.string().min(1),
  job: z.string().min(1),
  address: z.string().min(1),
  company: z.string().min(1),
  phone: z.string().min(1),
  card_type: z.enum(["Modern", "Minimal", "Corporate"]),
  social: z.array(
    z.object({
      id: z.string().optional(),
      platform: z.string().min(1),
      icon: z.string().optional(),
      url: z.string().url(),
    })
  ),
});

type ProfileFormType = z.infer<typeof formSchema>;

type Props = {
  onSuccess: () => void;
  createCardMutation: any;
  me: any;
};

export default function ProfileFormForModal({
  onSuccess,
  createCardMutation,
  me,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialIcons, setSocialIcons] = useState<Record<number, File | null>>(
    {}
  );
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({});

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "male",
      nationality: "Cambodian",
      dob: "",
      address: "",
      phone: "",
      card_type: "Minimal",
      web_site: "",
      bio: "",
      company: "",
      job: "",
      social: [{ platform: "", icon: "", url: "" }],
    },
  });

  const { control, handleSubmit, reset } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "social",
  });

  const isValidImage = (file: File) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024;
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  const onSubmit = async (values: ProfileFormType) => {
    setIsSubmitting(true);
    const updatedSocial = await Promise.all(
      values.social.map(async (item, index) => {
        const file = socialIcons[index];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await fetch("/api/v1/upload/upload-image", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return { ...item, icon: data.url };
        }
        return {
          ...item,
          icon: iconPreviews[index] || "",
        };
      })
    );
    const finalPayload = {
      ...values,
      email: me?.data?.email,
      password: "123456",
      social: updatedSocial,
    };
    createCardMutation.mutate(finalPayload, {
      onSuccess: () => {
        reset();
        setSocialIcons({});
        setIconPreviews({});
        setIsSubmitting(false);
        onSuccess();
      },
      onError: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto w-full">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto"
        >
          <FormField
            control={control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select
                    className="w-full border rounded p-2"
                    value={field.value}
                    onChange={field.onChange}
                    title="Gender"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nationality" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="job"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Job" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Company" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="web_site"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Website" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Bio" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Phone" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="card_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Type</FormLabel>
                <FormControl>
                  <select
                    className="w-full border rounded p-2"
                    value={field.value}
                    onChange={field.onChange}
                    title="Card Type"
                  >
                    <option value="Modern">Modern</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Dynamic Social Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Links</h3>
            {fields.map((fieldItem, index) => (
              <div
                key={fieldItem.id}
                className="border p-4 rounded-md space-y-3 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                {/* Icon Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon</label>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor={`icon-upload-${index}`}
                      className="cursor-pointer relative group"
                    >
                      <div className="w-12 h-12 rounded-md border bg-gray-100 overflow-hidden flex items-center justify-center">
                        {iconPreviews[index] ? (
                          <Avatar>
                            <AvatarImage
                              src={iconPreviews[index]}
                              alt="@icon"
                            />
                            <AvatarFallback>IC</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar>
                            <AvatarImage
                              src="https://github.com/evilrabbit.png"
                              alt="@icon"
                            />
                            <AvatarFallback>IC</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      {iconPreviews[index] && (
                        <button
                          type="button"
                          onClick={() => {
                            setSocialIcons((prev) => ({
                              ...prev,
                              [index]: null,
                            }));
                            setIconPreviews((prev) => {
                              const updated = { ...prev };
                              delete updated[index];
                              return updated;
                            });
                          }}
                          className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                        >
                          ✕
                        </button>
                      )}
                    </label>
                    <Input
                      id={`icon-upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && isValidImage(file)) {
                          setSocialIcons((prev) => ({
                            ...prev,
                            [index]: file,
                          }));
                          setIconPreviews((prev) => ({
                            ...prev,
                            [index]: URL.createObjectURL(file),
                          }));
                        } else {
                          alert("Icon must be an image under 2MB");
                        }
                      }}
                    />
                  </div>
                </div>
                {/* Platform */}
                <FormField
                  control={control}
                  name={`social.${index}.platform` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="facebook, instagram..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* URL */}
                <FormField
                  control={control}
                  name={`social.${index}.url` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Url</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ platform: "", icon: "", url: "" })}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Social Link
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || createCardMutation.isPending}
          >
            {isSubmitting || createCardMutation.isPending
              ? "Creating..."
              : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
