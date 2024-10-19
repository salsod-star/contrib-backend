import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import {
  MembershipManager,
  OrganizationManager,
  UserManager,
} from "../db/managers";
import { Organization } from "../db/models/organization";
import { Membership, UserRole } from "../db/models/membership";
import createAndSendToken from "../utils/createAndSendToken";

export const createOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserManager.findOneBy({ id: req.user.id });

    if (!user) {
      return res.status(200).json({
        status: "fail",
        message: "You are not authenticated. Login and try again",
      });
    }

    const { name } = req.body;

    const newOrg = new Organization();
    const newMembership = new Membership();

    newOrg.name = name;
    newOrg.adminId = user.id;

    const organization = await OrganizationManager.save(newOrg);

    newMembership.organization = organization;
    newMembership.user = user;
    newMembership.role = UserRole.ADMIN;

    user.ownerOrganizationId = organization.id;

    await UserManager.save(user);
    await MembershipManager.save(newMembership);

    res.status(200).json({
      status: "success",
      data: {
        organization,
      },
    });
  }
);

export const siginIntoOrganization = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authUser = req.user;
    const organizationId = req.params.organizationId;

    const organization = await OrganizationManager.findOneBy({
      id: organizationId,
    });

    if (!organization) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid organization ID",
      });
    }

    // get the unique membership detail of the authenticated user, else returns null
    const member = await MembershipManager.findOne({
      where: {
        organization: organization,
        user: authUser,
      },
      relations: {
        organization: true,
        user: true,
      },
    });

    if (!member) {
      return res.status(403).json({
        status: "fail",
        message: "You don't belong to this organization",
      });
    }

    createAndSendToken("orgJWT", organization.id, res);
  }
);
