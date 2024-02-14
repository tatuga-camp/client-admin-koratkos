import React, { useState } from "react";
import { User } from "../../model";
import {
  Button,
  FileTrigger,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import { AiFillPicture } from "react-icons/ai";
import Image from "next/image";
import { InputMask, InputMaskChangeEvent } from "primereact/inputmask";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import { UploadProfileUserService } from "../../services/user";
import ChangePassword from "./changePassword";

type GernerralDataProps = {
  user: DefinedUseQueryResult<User, Error>;
};
type UserData = {
  email: string;
};
function SecurityData({ user }: GernerralDataProps) {
  const [userData, setUserData] = useState<UserData>({
    email: user.data.email,
  });
  const [triggerChangePassword, setTriggerChangePassword] =
    useState<boolean>(false);

  const handleChangeUserData = (
    e: InputMaskChangeEvent | React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {triggerChangePassword && (
        <ChangePassword setTriggerChangePassword={setTriggerChangePassword} />
      )}
      <Form className="flex flex-col items-center justify-center gap-5">
        <div className="flex h-96 w-full justify-center gap-2 rounded-lg bg-fourth-color p-5 font-Anuphan">
          <div className="max flex flex-col items-start justify-center gap-5">
            <h2 className="text-2xl font-semibold text-[#C6A969]">
              E-mail และการเปลี่ยนรหัสผ่าน
            </h2>
            <TextField className="flex w-full items-center justify-start gap-2">
              <Label className="text-xl font-semibold text-super-main-color">
                E-mail :{" "}
              </Label>
              <Input
                disabled
                name="email"
                onChange={handleChangeUserData}
                value={userData.email}
                className="w-60 rounded-lg bg-white p-2 ring-1 ring-super-main-color"
              />
            </TextField>
            <Button
              onPress={() => {
                document.body.style.overflow = "hidden";
                setTriggerChangePassword(() => true);
              }}
              type="button"
              className="text-lg font-bold text-blue-700 underline"
            >
              เปลี่ยนรหัสผ่าน?
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default SecurityData;
